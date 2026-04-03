import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import type { DbWhatsAppShortcut } from '@/types/database'

const QUERY_KEY = 'whatsapp-shortcuts'

export function useWhatsAppShortcuts() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [QUERY_KEY, user.id],
    queryFn: async (): Promise<DbWhatsAppShortcut[]> => {
      const { data, error } = await supabase
        .from('whatsapp_shortcuts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data ?? []
    },
  })

  const createShortcut = useMutation({
    mutationFn: async (
      input: Omit<DbWhatsAppShortcut, 'id' | 'user_id' | 'created_at' | 'updated_at'>
    ): Promise<DbWhatsAppShortcut> => {
      const now = new Date().toISOString()
      const record: DbWhatsAppShortcut = {
        id: crypto.randomUUID(),
        user_id: user.id,
        created_at: now,
        updated_at: now,
        ...input,
      }

      const { error } = await supabase.from('whatsapp_shortcuts').insert(record)
      if (error) throw error
      return record
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const updateShortcut = useMutation({
    mutationFn: async (
      input: { id: string } & Partial<Omit<DbWhatsAppShortcut, 'id' | 'user_id' | 'created_at'>>
    ) => {
      const { id, ...updates } = input
      const now = new Date().toISOString()
      const { error } = await supabase
        .from('whatsapp_shortcuts')
        .update({ ...updates, updated_at: now })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const deleteShortcut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('whatsapp_shortcuts')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  return {
    shortcuts: query.data ?? [],
    isLoading: query.isLoading,
    createShortcut,
    updateShortcut,
    deleteShortcut,
  }
}
