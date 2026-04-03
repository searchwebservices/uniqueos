import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import type { DbUserProfile } from '@/types/database'

const QUERY_KEY = 'user_profile'

export function useUserProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [QUERY_KEY, user.id],
    queryFn: async (): Promise<DbUserProfile | null> => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        throw error
      }
      return data
    },
  })

  const updateProfile = useMutation({
    mutationFn: async (
      input: Partial<Pick<DbUserProfile, 'display_name' | 'avatar_url'>>,
    ) => {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY, user.id] })
      const prev = queryClient.getQueryData<DbUserProfile | null>([
        QUERY_KEY,
        user.id,
      ])

      queryClient.setQueryData<DbUserProfile | null>(
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

  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      const ext = file.name.split('.').pop()
      const path = `avatars/${user.id}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('user-avatars').getPublicUrl(path)

      await supabase
        .from('user_profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      return publicUrl
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user.id] })
    },
  })

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    updateProfile,
    uploadAvatar,
  }
}
