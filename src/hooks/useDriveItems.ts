import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { getDemoDriveItems, getDemoDriveFolderPath } from '@/lib/demo-data'
import type { DbDriveItem } from '@/types/database'

const QUERY_KEY = 'drive_items'

const DRIVE_BUCKET = 'drive'
const DRIVE_PUBLIC_BUCKET = 'drive-public'

export function useDriveItems(parentId: string | null = null) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [QUERY_KEY, user.id, parentId],
    queryFn: async (): Promise<DbDriveItem[]> => {
      let q = supabase
        .from('drive_items')
        .select('*')
        .eq('user_id', user.id)

      if (parentId === null) {
        q = q.is('parent_id', null)
      } else {
        q = q.eq('parent_id', parentId)
      }

      q = q.order('type', { ascending: true }).order('name', { ascending: true })

      const { data, error } = await q
      if (error) throw error

      // If Supabase returned real data, use it; otherwise fall back to demo
      if (data && data.length > 0) return data
      return getDemoDriveItems(parentId)
    },
  })

  const createFolder = useMutation({
    mutationFn: async (name: string) => {
      const now = new Date().toISOString()
      const record: DbDriveItem = {
        id: crypto.randomUUID(),
        user_id: user.id,
        parent_id: parentId,
        name,
        type: 'folder',
        mime_type: null,
        size_bytes: null,
        storage_path: null,
        public_url: null,
        is_published: false,
        google_file_id: null,
        metadata: {},
        created_at: now,
        updated_at: now,
      }

      const { error } = await supabase.from('drive_items').insert(record)
      if (error) throw error
      return record
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      const fileId = crypto.randomUUID()
      const storagePath = `${user.id}/${fileId}/${file.name}`

      const { error: uploadError } = await supabase.storage
        .from(DRIVE_BUCKET)
        .upload(storagePath, file)

      if (uploadError) throw uploadError

      const now = new Date().toISOString()
      const record: DbDriveItem = {
        id: fileId,
        user_id: user.id,
        parent_id: parentId,
        name: file.name,
        type: 'file',
        mime_type: file.type || 'application/octet-stream',
        size_bytes: file.size,
        storage_path: storagePath,
        public_url: null,
        is_published: false,
        google_file_id: null,
        metadata: {},
        created_at: now,
        updated_at: now,
      }

      const { error: dbError } = await supabase.from('drive_items').insert(record)
      if (dbError) throw dbError
      return record
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const renameItem = useMutation({
    mutationFn: async (input: { id: string; name: string }) => {
      const { error } = await supabase
        .from('drive_items')
        .update({ name: input.name, updated_at: new Date().toISOString() })
        .eq('id', input.id)
      if (error) throw error
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const key = [QUERY_KEY, user.id, parentId]
      const prev = queryClient.getQueryData<DbDriveItem[]>(key)

      queryClient.setQueryData<DbDriveItem[]>(key, (old) =>
        old?.map((item) =>
          item.id === input.id ? { ...item, name: input.name } : item,
        ),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData([QUERY_KEY, user.id, parentId], context.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const moveItem = useMutation({
    mutationFn: async (input: { id: string; newParentId: string | null }) => {
      const { error } = await supabase
        .from('drive_items')
        .update({
          parent_id: input.newParentId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
      if (error) throw error
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const deleteItem = useMutation({
    mutationFn: async (item: DbDriveItem) => {
      // Delete storage file if it exists
      if (item.storage_path) {
        await supabase.storage.from(DRIVE_BUCKET).remove([item.storage_path])
      }
      // Delete public copy if published
      if (item.is_published && item.storage_path) {
        const publicPath = `${user.id}/${item.id}/${item.name}`
        await supabase.storage.from(DRIVE_PUBLIC_BUCKET).remove([publicPath])
      }
      // Delete DB record (cascades for folders)
      const { error } = await supabase
        .from('drive_items')
        .delete()
        .eq('id', item.id)
      if (error) throw error
    },
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })
      const key = [QUERY_KEY, user.id, parentId]
      const prev = queryClient.getQueryData<DbDriveItem[]>(key)

      queryClient.setQueryData<DbDriveItem[]>(key, (old) =>
        old?.filter((i) => i.id !== item.id),
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData([QUERY_KEY, user.id, parentId], context.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const publishItem = useMutation({
    mutationFn: async (item: DbDriveItem) => {
      if (!item.storage_path || item.type === 'folder') {
        throw new Error('Can only publish files with storage paths')
      }

      // Download file from private bucket
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(DRIVE_BUCKET)
        .download(item.storage_path)

      if (downloadError || !fileData) throw downloadError ?? new Error('Download failed')

      // Upload to public bucket
      const publicPath = `${user.id}/${item.id}/${item.name}`
      const { error: uploadError } = await supabase.storage
        .from(DRIVE_PUBLIC_BUCKET)
        .upload(publicPath, fileData, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(DRIVE_PUBLIC_BUCKET)
        .getPublicUrl(publicPath)

      // Update DB record
      const { error: updateError } = await supabase
        .from('drive_items')
        .update({
          is_published: true,
          public_url: urlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id)

      if (updateError) throw updateError
      return urlData.publicUrl
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const unpublishItem = useMutation({
    mutationFn: async (item: DbDriveItem) => {
      // Remove from public bucket
      const publicPath = `${user.id}/${item.id}/${item.name}`
      await supabase.storage.from(DRIVE_PUBLIC_BUCKET).remove([publicPath])

      // Update DB record
      const { error } = await supabase
        .from('drive_items')
        .update({
          is_published: false,
          public_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id)

      if (error) throw error
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createFolder,
    uploadFile,
    renameItem,
    moveItem,
    deleteItem,
    publishItem,
    unpublishItem,
  }
}

/**
 * Get a signed URL for downloading/previewing a private file.
 */
export async function getSignedUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(DRIVE_BUCKET)
    .createSignedUrl(storagePath, 300) // 5 minute TTL

  if (error || !data?.signedUrl) throw error ?? new Error('Failed to create signed URL')
  return data.signedUrl
}

/**
 * Get breadcrumb path for a folder.
 */
export function useFolderPath(folderId: string | null) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['drive_folder_path', user.id, folderId],
    queryFn: async (): Promise<DbDriveItem[]> => {
      if (!folderId) return []

      const path: DbDriveItem[] = []
      let currentId: string | null = folderId

      while (currentId) {
        const { data, error } = await supabase
          .from('drive_items')
          .select('*')
          .eq('id', currentId)
          .single()
        const item = data as DbDriveItem | null

        if (error || !item) {
          // Fall back to demo data
          return getDemoDriveFolderPath(folderId)
        }
        path.unshift(item)
        currentId = item.parent_id
      }

      if (path.length === 0) {
        return getDemoDriveFolderPath(folderId)
      }

      return path
    },
    enabled: folderId !== null,
  })
}
