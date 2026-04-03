import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DockItem } from '@/types/os'

interface DockStore {
  items: DockItem[]
  badges: Record<string, number>

  setItems: (items: DockItem[]) => void
  addItem: (appId: string) => void
  removeItem: (appId: string) => void
  reorder: (fromIndex: number, toIndex: number) => void
  setBadge: (appId: string, count: number) => void
  clearBadge: (appId: string) => void
}

export const useDockStore = create<DockStore>()(
  persist(
    (set) => ({
      items: [],
      badges: {},

      setItems: (items) => set({ items }),

      addItem: (appId) => set(state => {
        if (state.items.some(i => i.appId === appId)) return state
        return { items: [...state.items, { appId, order: state.items.length }] }
      }),

      removeItem: (appId) => set(state => ({
        items: state.items
          .filter(i => i.appId !== appId)
          .map((item, idx) => ({ ...item, order: idx })),
      })),

      reorder: (fromIndex, toIndex) => set(state => {
        const items = [...state.items]
        const [moved] = items.splice(fromIndex, 1)
        items.splice(toIndex, 0, moved)
        return { items: items.map((item, idx) => ({ ...item, order: idx })) }
      }),

      setBadge: (appId, count) => set(state => ({
        badges: { ...state.badges, [appId]: count },
      })),

      clearBadge: (appId) => set(state => {
        const badges = { ...state.badges }
        delete badges[appId]
        return { badges }
      }),
    }),
    { name: 'tabletop-dock' }
  )
)
