import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import type { DbUserSettings } from '@/types/database'

const QUERY_KEY = 'user_settings'

export function useUserSettings() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [QUERY_KEY, user.id],
    queryFn: async (): Promise<DbUserSettings | null> => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        // If no settings row yet, return null
        if (error.code === 'PGRST116') return null
        throw error
      }
      return data
    },
  })

  const updateSettings = useMutation({
    mutationFn: async (input: Partial<DbUserSettings>) => {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          id: user.id,
          ...input,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY, user.id] })
      const prev = queryClient.getQueryData<DbUserSettings | null>([
        QUERY_KEY,
        user.id,
      ])

      queryClient.setQueryData<DbUserSettings | null>(
        [QUERY_KEY, user.id],
        (old) => (old ? { ...old, ...input } : null),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev !== undefined) {
        queryClient.setQueryData([QUERY_KEY, user.id], context.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user.id] })
    },
  })

  return {
    settings: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    updateSettings,
  }
}
