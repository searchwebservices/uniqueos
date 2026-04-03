import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { offlineDb } from '@/lib/offline-db'
import { syncWrite } from '@/lib/sync'
import { DEMO_CALENDAR_EVENTS } from '@/lib/demo-data'
import type { DbCalendarEvent } from '@/types/database'

const QUERY_KEY = 'calendar_events'

function filterByRange(events: DbCalendarEvent[], rangeStart?: string, rangeEnd?: string) {
  return events
    .filter((e) => {
      if (rangeStart && e.start_at < rangeStart) return false
      if (rangeEnd && e.start_at > rangeEnd) return false
      return true
    })
    .sort((a, b) => a.start_at.localeCompare(b.start_at))
}

export function useCalendarEvents(opts?: {
  rangeStart?: string
  rangeEnd?: string
}) {
  const { user } = useAuth()
  const isOnline = useOnlineStatus()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [QUERY_KEY, user.id, opts?.rangeStart, opts?.rangeEnd],
    queryFn: async (): Promise<DbCalendarEvent[]> => {
      if (isOnline) {
        let q = supabase
          .from('calendar_events')
          .select('*')
          .eq('user_id', user.id)
          .order('start_at', { ascending: true })

        if (opts?.rangeStart) {
          q = q.gte('start_at', opts.rangeStart)
        }
        if (opts?.rangeEnd) {
          q = q.lte('start_at', opts.rangeEnd)
        }

        const { data, error } = await q
        if (error) throw error

        // If Supabase returned real data, use it; otherwise fall back to demo
        if (data && data.length > 0) return data
        return filterByRange(DEMO_CALENDAR_EVENTS, opts?.rangeStart, opts?.rangeEnd)
      }

      // Offline: read from IndexedDB
      let collection = offlineDb.calendar_events
        .where('user_id')
        .equals(user.id)

      const all = await collection.toArray()

      // Fall back to demo data if IndexedDB is empty
      if (all.length === 0) {
        return filterByRange(DEMO_CALENDAR_EVENTS, opts?.rangeStart, opts?.rangeEnd)
      }

      return all
        .filter((e) => {
          if (opts?.rangeStart && e.start_at < opts.rangeStart) return false
          if (opts?.rangeEnd && e.start_at > opts.rangeEnd) return false
          return true
        })
        .sort((a, b) => a.start_at.localeCompare(b.start_at))
    },
  })

  const createEvent = useMutation({
    mutationFn: async (
      input: Omit<DbCalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    ) => {
      const now = new Date().toISOString()
      const record: DbCalendarEvent = {
        id: crypto.randomUUID(),
        user_id: user.id,
        created_at: now,
        updated_at: now,
        ...input,
      }

      await syncWrite('calendar_events', 'insert', record.id, record, isOnline)
      return record
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const updateEvent = useMutation({
    mutationFn: async (input: { id: string } & Partial<DbCalendarEvent>) => {
      const { id, ...updates } = input
      const payload = { ...updates, id, updated_at: new Date().toISOString() }

      await syncWrite('calendar_events', 'update', id, payload, isOnline)
      return payload
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const prev = queryClient.getQueryData<DbCalendarEvent[]>([
        QUERY_KEY,
        user.id,
        opts?.rangeStart,
        opts?.rangeEnd,
      ])

      queryClient.setQueryData<DbCalendarEvent[]>(
        [QUERY_KEY, user.id, opts?.rangeStart, opts?.rangeEnd],
        (old) =>
          old?.map((e) =>
            e.id === input.id ? { ...e, ...input } : e,
          ),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEY, user.id, opts?.rangeStart, opts?.rangeEnd],
          context.prev,
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      await syncWrite('calendar_events', 'delete', id, { id }, isOnline)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const prev = queryClient.getQueryData<DbCalendarEvent[]>([
        QUERY_KEY,
        user.id,
        opts?.rangeStart,
        opts?.rangeEnd,
      ])

      queryClient.setQueryData<DbCalendarEvent[]>(
        [QUERY_KEY, user.id, opts?.rangeStart, opts?.rangeEnd],
        (old) => old?.filter((e) => e.id !== id),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEY, user.id, opts?.rangeStart, opts?.rangeEnd],
          context.prev,
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  return {
    events: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createEvent,
    updateEvent,
    deleteEvent,
  }
}
