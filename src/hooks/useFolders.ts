import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import type { DbDesktopFolder, DbDesktopFolderItem, FolderIconPreset } from '@/types/database'

const FOLDERS_KEY = 'desktop_folders'
const FOLDER_ITEMS_KEY = 'folder_items'

export function useFolders() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const foldersQuery = useQuery({
    queryKey: [FOLDERS_KEY, user.id],
    queryFn: async (): Promise<DbDesktopFolder[]> => {
      const { data, error } = await supabase
        .from('desktop_folders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at')
      if (error) throw error
      return data ?? []
    },
  })

  const createFolder = useMutation({
    mutationFn: async (input: { name: string; icon_preset?: FolderIconPreset; color?: string; parent_id?: string }) => {
      const { data, error } = await supabase
        .from('desktop_folders')
        .insert({
          user_id: user.id,
          name: input.name,
          icon_preset: input.icon_preset ?? 'folder',
          color: input.color ?? '#b87a4b',
          parent_id: input.parent_id ?? null,
        })
        .select()
        .single()
      if (error) throw error
      return data as DbDesktopFolder
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [FOLDERS_KEY, user.id] }),
  })

  const updateFolder = useMutation({
    mutationFn: async ({ id, ...input }: Partial<DbDesktopFolder> & { id: string }) => {
      const { error } = await supabase
        .from('desktop_folders')
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [FOLDERS_KEY, user.id] }),
  })

  const deleteFolder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('desktop_folders').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [FOLDERS_KEY, user.id] }),
  })

  return {
    folders: foldersQuery.data ?? [],
    isLoading: foldersQuery.isLoading,
    createFolder,
    updateFolder,
    deleteFolder,
  }
}

export function useFolderItems(folderId: string | null) {
  const qc = useQueryClient()

  const itemsQuery = useQuery({
    queryKey: [FOLDER_ITEMS_KEY, folderId],
    enabled: !!folderId,
    queryFn: async (): Promise<DbDesktopFolderItem[]> => {
      const { data, error } = await supabase
        .from('desktop_folder_items')
        .select('*')
        .eq('folder_id', folderId!)
        .order('sort_order')
      if (error) throw error
      return data ?? []
    },
  })

  const addItem = useMutation({
    mutationFn: async (input: { item_type: string; item_id: string; label?: string }) => {
      const { data, error } = await supabase
        .from('desktop_folder_items')
        .insert({
          folder_id: folderId!,
          item_type: input.item_type,
          item_id: input.item_id,
          label: input.label ?? null,
          sort_order: (itemsQuery.data?.length ?? 0),
        })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [FOLDER_ITEMS_KEY, folderId] }),
  })

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.from('desktop_folder_items').delete().eq('id', itemId)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [FOLDER_ITEMS_KEY, folderId] }),
  })

  return {
    items: itemsQuery.data ?? [],
    isLoading: itemsQuery.isLoading,
    addItem,
    removeItem,
  }
}
