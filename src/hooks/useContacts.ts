import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import type { DbContact } from '@/types/database'

const QUERY_KEY = 'contacts'

export function useContacts() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [QUERY_KEY, user.id],
    queryFn: async (): Promise<DbContact[]> => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('favorite', { ascending: false })
        .order('name', { ascending: true })

      if (error) throw error
      return data ?? []
    },
  })

  const createContact = useMutation({
    mutationFn: async (
      input: Partial<Omit<DbContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
    ) => {
      const now = new Date().toISOString()
      const record = {
        id: crypto.randomUUID(),
        user_id: user.id,
        name: input.name ?? 'Untitled',
        nickname: input.nickname ?? null,
        email: input.email ?? null,
        phone: input.phone ?? null,
        avatar_url: input.avatar_url ?? null,
        tags: input.tags ?? [],
        relationship: input.relationship ?? 'other',
        company: input.company ?? null,
        job_title: input.job_title ?? null,
        socials: input.socials ?? {},
        address: input.address ?? null,
        notes: input.notes ?? null,
        favorite: input.favorite ?? false,
        created_at: now,
        updated_at: now,
      }

      const { data, error } = await supabase
        .from('contacts')
        .insert(record)
        .select()
        .single()

      if (error) throw error
      return data as DbContact
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const updateContact = useMutation({
    mutationFn: async (input: { id: string } & Partial<DbContact>) => {
      const { id, ...updates } = input
      const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('contacts')
        .update(payload)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as DbContact
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const key = [QUERY_KEY, user.id]
      const prev = queryClient.getQueryData<DbContact[]>(key)

      queryClient.setQueryData<DbContact[]>(key, (old) =>
        old?.map((c) => (c.id === input.id ? { ...c, ...input } : c)),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData([QUERY_KEY, user.id], context.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const key = [QUERY_KEY, user.id]
      const prev = queryClient.getQueryData<DbContact[]>(key)

      queryClient.setQueryData<DbContact[]>(key, (old) =>
        old?.filter((c) => c.id !== id),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData([QUERY_KEY, user.id], context.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const uploadAvatar = useMutation({
    mutationFn: async ({ contactId, file }: { contactId: string; file: File }) => {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${user.id}/${contactId}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('contact-avatars')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('contact-avatars')
        .getPublicUrl(path)

      const avatar_url = urlData.publicUrl

      const { data, error } = await supabase
        .from('contacts')
        .update({ avatar_url, updated_at: new Date().toISOString() })
        .eq('id', contactId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as DbContact
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  return {
    contacts: query.data ?? [],
    isLoading: query.isLoading,
    createContact,
    updateContact,
    deleteContact,
    uploadAvatar,
  }
}
