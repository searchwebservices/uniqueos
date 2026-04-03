import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { offlineDb } from '@/lib/offline-db'
import { syncWrite } from '@/lib/sync'
import type { DbTask } from '@/types/database'

const QUERY_KEY = 'tasks'

export function useTasks(opts?: {
  status?: DbTask['status']
  sortBy?: 'due_date' | 'priority' | 'sort_order'
}) {
  const { user } = useAuth()
  const isOnline = useOnlineStatus()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [QUERY_KEY, user.id, opts?.status, opts?.sortBy],
    queryFn: async (): Promise<DbTask[]> => {
      if (isOnline) {
        let q = supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)

        if (opts?.status) {
          q = q.eq('status', opts.status)
        }

        q = q.order(opts?.sortBy ?? 'sort_order', { ascending: true })

        const { data, error } = await q
        if (error) throw error
        return data ?? []
      }

      const all = await offlineDb.tasks
        .where('user_id')
        .equals(user.id)
        .toArray()

      return all
        .filter((t) => {
          if (opts?.status && t.status !== opts.status) return false
          return true
        })
        .sort((a, b) => a.sort_order - b.sort_order)
    },
  })

  const createTask = useMutation({
    mutationFn: async (
      input: Omit<DbTask, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    ) => {
      const now = new Date().toISOString()
      const record: DbTask = {
        id: crypto.randomUUID(),
        user_id: user.id,
        created_at: now,
        updated_at: now,
        ...input,
      }

      await syncWrite('tasks', 'insert', record.id, record, isOnline)
      return record
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const updateTask = useMutation({
    mutationFn: async (input: { id: string } & Partial<DbTask>) => {
      const { id, ...updates } = input
      const now = new Date().toISOString()
      const payload: Partial<DbTask> & { id: string } = {
        ...updates,
        id,
        updated_at: now,
      }

      // Auto-set completed_at
      if (updates.status === 'done') {
        payload.completed_at = now
      } else if (updates.status) {
        payload.completed_at = null
      }

      await syncWrite('tasks', 'update', id, payload, isOnline)
      return payload
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const key = [QUERY_KEY, user.id, opts?.status, opts?.sortBy]
      const prev = queryClient.getQueryData<DbTask[]>(key)

      queryClient.setQueryData<DbTask[]>(key, (old) =>
        old?.map((t) => (t.id === input.id ? { ...t, ...input } : t)),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEY, user.id, opts?.status, opts?.sortBy],
          context.prev,
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await syncWrite('tasks', 'delete', id, { id }, isOnline)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const key = [QUERY_KEY, user.id, opts?.status, opts?.sortBy]
      const prev = queryClient.getQueryData<DbTask[]>(key)

      queryClient.setQueryData<DbTask[]>(key, (old) =>
        old?.filter((t) => t.id !== id),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEY, user.id, opts?.status, opts?.sortBy],
          context.prev,
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createTask,
    updateTask,
    deleteTask,
  }
}
