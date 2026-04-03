import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PageShortcut {
  id: string
  name: string
  appId: string
  /** Meta passed to openWindow — e.g. { coupleId: '123' } */
  meta: Record<string, unknown>
  color: string
  iconKey?: string
}

interface PageShortcutsStore {
  shortcuts: PageShortcut[]
  addShortcut: (shortcut: Omit<PageShortcut, 'id'>) => string
  removeShortcut: (id: string) => void
  updateShortcut: (id: string, updates: Partial<Omit<PageShortcut, 'id'>>) => void
}

export const usePageShortcuts = create<PageShortcutsStore>()(
  persist(
    (set) => ({
      shortcuts: [],

      addShortcut: (input) => {
        const id = crypto.randomUUID()
        set((state) => ({
          shortcuts: [...state.shortcuts, { ...input, id }],
        }))
        return id
      },

      removeShortcut: (id) =>
        set((state) => ({
          shortcuts: state.shortcuts.filter((s) => s.id !== id),
        })),

      updateShortcut: (id, updates) =>
        set((state) => ({
          shortcuts: state.shortcuts.map((s) =>
            s.id === id ? { ...s, ...updates } : s,
          ),
        })),
    }),
    {
      name: 'uniqueos-page-shortcuts',
      version: 1,
    },
  ),
)
