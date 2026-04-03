import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { offlineDb } from '@/lib/offline-db'
import { syncWrite } from '@/lib/sync'
import type { DbNote } from '@/types/database'

const QUERY_KEY = 'notes'

export function useNotes(opts?: { search?: string }) {
  const { user } = useAuth()
  const isOnline = useOnlineStatus()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [QUERY_KEY, user.id, opts?.search],
    queryFn: async (): Promise<DbNote[]> => {
      if (isOnline) {
        let q = supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)

        if (opts?.search) {
          q = q.ilike('plain_text', `%${opts.search}%`)
        }

        q = q
          .order('pinned', { ascending: false })
          .order('updated_at', { ascending: false })

        const { data, error } = await q
        if (error) throw error
        return data ?? []
      }

      // Offline: read from IndexedDB
      const all = await offlineDb.notes
        .where('user_id')
        .equals(user.id)
        .toArray()

      let filtered = all
      if (opts?.search) {
        const lower = opts.search.toLowerCase()
        filtered = filtered.filter(
          (n) => n.plain_text?.toLowerCase().includes(lower),
        )
      }

      return filtered.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return b.updated_at.localeCompare(a.updated_at)
      })
    },
  })

  const createNote = useMutation({
    mutationFn: async (
      input?: Partial<Pick<DbNote, 'title' | 'content' | 'plain_text'>>,
    ) => {
      const now = new Date().toISOString()
      const record: DbNote = {
        id: crypto.randomUUID(),
        user_id: user.id,
        title: input?.title ?? 'Untitled',
        content: input?.content ?? null,
        plain_text: input?.plain_text ?? null,
        pinned: false,
        sort_order: 0,
        created_at: now,
        updated_at: now,
      }

      await syncWrite('notes', 'insert', record.id, record, isOnline)
      return record
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const updateNote = useMutation({
    mutationFn: async (input: { id: string } & Partial<DbNote>) => {
      const { id, ...updates } = input
      const payload = { ...updates, id, updated_at: new Date().toISOString() }

      await syncWrite('notes', 'update', id, payload, isOnline)
      return payload
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const key = [QUERY_KEY, user.id, opts?.search]
      const prev = queryClient.getQueryData<DbNote[]>(key)

      queryClient.setQueryData<DbNote[]>(key, (old) =>
        old?.map((n) => (n.id === input.id ? { ...n, ...input } : n)),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEY, user.id, opts?.search],
          context.prev,
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const togglePin = useMutation({
    mutationFn: async (input: { id: string; pinned: boolean }) => {
      const payload = {
        id: input.id,
        pinned: input.pinned,
        updated_at: new Date().toISOString(),
      }
      await syncWrite('notes', 'update', input.id, payload, isOnline)
      return payload
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const key = [QUERY_KEY, user.id, opts?.search]
      const prev = queryClient.getQueryData<DbNote[]>(key)

      queryClient.setQueryData<DbNote[]>(key, (old) =>
        old?.map((n) =>
          n.id === input.id ? { ...n, pinned: input.pinned } : n,
        ),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEY, user.id, opts?.search],
          context.prev,
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      await syncWrite('notes', 'delete', id, { id }, isOnline)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const key = [QUERY_KEY, user.id, opts?.search]
      const prev = queryClient.getQueryData<DbNote[]>(key)

      queryClient.setQueryData<DbNote[]>(key, (old) =>
        old?.filter((n) => n.id !== id),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEY, user.id, opts?.search],
          context.prev,
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  return {
    notes: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createNote,
    updateNote,
    togglePin,
    deleteNote,
  }
}

/**
 * Fetch a single note by ID.
 */
export function useNote(noteId: string | null) {
  const { user } = useAuth()
  const isOnline = useOnlineStatus()

  return useQuery({
    queryKey: ['note', user.id, noteId],
    queryFn: async (): Promise<DbNote | null> => {
      if (!noteId) return null

      if (isOnline) {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('id', noteId)
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        return data
      }

      const cached = await offlineDb.notes.get(noteId)
      return cached ?? null
    },
    enabled: noteId !== null,
  })
}

/**
 * Search notes by plain_text content.
 */
export function useNoteSearch(searchQuery: string) {
  return useNotes({ search: searchQuery || undefined })
}
