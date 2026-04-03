import { create } from 'zustand'

export type DesktopItemType = 'app' | 'shortcut' | 'page' | 'folder'

export interface DesktopSelection {
  type: DesktopItemType
  id: string
}

interface DesktopSelectionStore {
  selected: DesktopSelection[]
  select: (type: DesktopItemType, id: string) => void
  toggleSelect: (type: DesktopItemType, id: string) => void
  selectMultiple: (items: DesktopSelection[]) => void
  deselect: () => void
}

export const useDesktopSelection = create<DesktopSelectionStore>()((set) => ({
  selected: [],
  select: (type, id) => set({ selected: [{ type, id }] }),
  toggleSelect: (type, id) =>
    set((state) => {
      const idx = state.selected.findIndex((s) => s.type === type && s.id === id)
      if (idx >= 0) {
        return { selected: state.selected.filter((_, i) => i !== idx) }
      }
      return { selected: [...state.selected, { type, id }] }
    }),
  selectMultiple: (items) => set({ selected: items }),
  deselect: () => set({ selected: [] }),
}))
