import { useFoldersStore, type LocalFolder } from '@/stores/folders-store'
import { useMemo } from 'react'
import type { FolderIconPreset } from '@/types/database'

/**
 * Hook that wraps the local Zustand folders store with an API
 * matching the original react-query interface so existing components
 * (FolderCreateDialog, FolderIcon, FolderView, DesktopSurface) keep working.
 */
export function useFolders() {
  const folders = useFoldersStore((s) => s.folders)
  const createFolderFn = useFoldersStore((s) => s.createFolder)
  const updateFolderFn = useFoldersStore((s) => s.updateFolder)
  const deleteFolderFn = useFoldersStore((s) => s.deleteFolder)

  // Mimic react-query mutation shape
  const createFolder = useMemo(
    () => ({
      mutate: (
        input: { name: string; icon_preset?: FolderIconPreset; color?: string; parent_id?: string },
        opts?: { onSuccess?: () => void },
      ) => {
        createFolderFn(input)
        opts?.onSuccess?.()
      },
      mutateAsync: async (
        input: { name: string; icon_preset?: FolderIconPreset; color?: string; parent_id?: string },
      ) => {
        return createFolderFn(input)
      },
      isPending: false,
    }),
    [createFolderFn],
  )

  const updateFolder = useMemo(
    () => ({
      mutate: (input: Partial<LocalFolder> & { id: string }) => {
        const { id, ...updates } = input
        updateFolderFn(id, updates)
      },
      isPending: false,
    }),
    [updateFolderFn],
  )

  const deleteFolder = useMemo(
    () => ({
      mutate: (id: string) => {
        deleteFolderFn(id)
      },
      isPending: false,
    }),
    [deleteFolderFn],
  )

  return {
    folders,
    isLoading: false,
    createFolder,
    updateFolder,
    deleteFolder,
  }
}

export function useFolderItems(folderId: string | null) {
  const allItems = useFoldersStore((s) => s.items)
  const addItemFn = useFoldersStore((s) => s.addItem)
  const removeItemFn = useFoldersStore((s) => s.removeItem)

  const items = useMemo(
    () =>
      folderId
        ? allItems.filter((i) => i.folder_id === folderId).sort((a, b) => a.sort_order - b.sort_order)
        : [],
    [allItems, folderId],
  )

  const addItem = useMemo(
    () => ({
      mutate: (input: { item_type: string; item_id: string; label?: string }) => {
        if (!folderId) return
        addItemFn(folderId, input as { item_type: 'app' | 'shortcut' | 'subfolder' | 'file' | 'link' | 'contact'; item_id: string; label?: string })
      },
      isPending: false,
    }),
    [addItemFn, folderId],
  )

  const removeItem = useMemo(
    () => ({
      mutate: (itemId: string) => {
        removeItemFn(itemId)
      },
      isPending: false,
    }),
    [removeItemFn],
  )

  return {
    items,
    isLoading: false,
    addItem,
    removeItem,
  }
}
