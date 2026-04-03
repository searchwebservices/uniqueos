import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FolderIconPreset, FolderItemType } from '@/types/database'

export interface LocalFolder {
  id: string
  user_id: string
  name: string
  parent_id: string | null
  icon_preset: FolderIconPreset
  color: string
  config: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface LocalFolderItem {
  id: string
  folder_id: string
  item_type: FolderItemType
  item_id: string
  label: string | null
  sort_order: number
  config: Record<string, unknown>
  created_at: string
}

interface FoldersStore {
  folders: LocalFolder[]
  items: LocalFolderItem[]

  createFolder: (input: {
    name: string
    icon_preset?: FolderIconPreset
    color?: string
    parent_id?: string
  }) => LocalFolder

  updateFolder: (id: string, updates: Partial<Omit<LocalFolder, 'id'>>) => void
  deleteFolder: (id: string) => void

  addItem: (folderId: string, input: {
    item_type: FolderItemType
    item_id: string
    label?: string
  }) => LocalFolderItem

  removeItem: (itemId: string) => void
  getItemsForFolder: (folderId: string) => LocalFolderItem[]
}

export const useFoldersStore = create<FoldersStore>()(
  persist(
    (set, get) => ({
      folders: [],
      items: [],

      createFolder: (input) => {
        const now = new Date().toISOString()
        const folder: LocalFolder = {
          id: crypto.randomUUID(),
          user_id: 'local',
          name: input.name,
          parent_id: input.parent_id ?? null,
          icon_preset: input.icon_preset ?? 'folder',
          color: input.color ?? '#3d8b9e',
          config: {},
          created_at: now,
          updated_at: now,
        }
        set((state) => ({ folders: [...state.folders, folder] }))
        return folder
      },

      updateFolder: (id, updates) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === id
              ? { ...f, ...updates, updated_at: new Date().toISOString() }
              : f,
          ),
        })),

      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          items: state.items.filter((i) => i.folder_id !== id),
        })),

      addItem: (folderId, input) => {
        const existingItems = get().items.filter((i) => i.folder_id === folderId)
        const item: LocalFolderItem = {
          id: crypto.randomUUID(),
          folder_id: folderId,
          item_type: input.item_type,
          item_id: input.item_id,
          label: input.label ?? null,
          sort_order: existingItems.length,
          config: {},
          created_at: new Date().toISOString(),
        }
        set((state) => ({ items: [...state.items, item] }))
        return item
      },

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      getItemsForFolder: (folderId) =>
        get().items
          .filter((i) => i.folder_id === folderId)
          .sort((a, b) => a.sort_order - b.sort_order),
    }),
    {
      name: 'uniqueos-desktop-folders',
      version: 1,
    },
  ),
)
