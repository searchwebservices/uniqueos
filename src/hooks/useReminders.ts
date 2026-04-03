import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { offlineDb } from '@/lib/offline-db'
import { syncWrite } from '@/lib/sync'
import type { DbReminder } from '@/types/database'

const QUERY_KEY = 'reminders'

export function useReminders(opts?: { completed?: boolean }) {
  const { user } = useAuth()
  const isOnline = useOnlineStatus()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [QUERY_KEY, user.id, opts?.completed],
    queryFn: async (): Promise<DbReminder[]> => {
      if (isOnline) {
        let q = supabase
          .from('reminders')
          .select('*')
          .eq('user_id', user.id)

        if (opts?.completed !== undefined) {
          q = q.eq('completed', opts.completed)
        }

        q = q.order('remind_at', { ascending: true })

        const { data, error } = await q
        if (error) throw error
        return data ?? []
      }

      const all = await offlineDb.reminders
        .where('user_id')
        .equals(user.id)
        .toArray()

      return all
        .filter((r) => {
          if (opts?.completed !== undefined && r.completed !== opts.completed)
            return false
          return true
        })
        .sort((a, b) => a.remind_at.localeCompare(b.remind_at))
    },
  })

  const createReminder = useMutation({
    mutationFn: async (
      input: Omit<DbReminder, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    ) => {
      const now = new Date().toISOString()
      const record: DbReminder = {
        id: crypto.randomUUID(),
        user_id: user.id,
        created_at: now,
        updated_at: now,
        ...input,
      }

      await syncWrite('reminders', 'insert', record.id, record, isOnline)
      return record
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const updateReminder = useMutation({
    mutationFn: async (input: { id: string } & Partial<DbReminder>) => {
      const { id, ...updates } = input
      const payload = { ...updates, id, updated_at: new Date().toISOString() }

      await syncWrite('reminders', 'update', id, payload, isOnline)
      return payload
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const key = [QUERY_KEY, user.id, opts?.completed]
      const prev = queryClient.getQueryData<DbReminder[]>(key)

      queryClient.setQueryData<DbReminder[]>(key, (old) =>
        old?.map((r) => (r.id === input.id ? { ...r, ...input } : r)),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEY, user.id, opts?.completed],
          context.prev,
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const completeReminder = useMutation({
    mutationFn: async (id: string) => {
      const now = new Date().toISOString()
      const payload = {
        id,
        completed: true,
        completed_at: now,
        updated_at: now,
      }

      await syncWrite('reminders', 'update', id, payload, isOnline)
      return payload
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const key = [QUERY_KEY, user.id, opts?.completed]
      const prev = queryClient.getQueryData<DbReminder[]>(key)

      queryClient.setQueryData<DbReminder[]>(key, (old) =>
        old?.map((r) =>
          r.id === id
            ? { ...r, completed: true, completed_at: new Date().toISOString() }
            : r,
        ),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEY, user.id, opts?.completed],
          context.prev,
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const deleteReminder = useMutation({
    mutationFn: async (id: string) => {
      await syncWrite('reminders', 'delete', id, { id }, isOnline)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const key = [QUERY_KEY, user.id, opts?.completed]
      const prev = queryClient.getQueryData<DbReminder[]>(key)

      queryClient.setQueryData<DbReminder[]>(key, (old) =>
        old?.filter((r) => r.id !== id),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEY, user.id, opts?.completed],
          context.prev,
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  return {
    reminders: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createReminder,
    updateReminder,
    completeReminder,
    deleteReminder,
  }
}
