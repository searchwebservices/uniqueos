import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DesktopItemOverride {
  name?: string
  color?: string
  iconKey?: string
}

interface DesktopCustomizationStore {
  overrides: Record<string, DesktopItemOverride>
  setOverride: (key: string, override: DesktopItemOverride) => void
  removeOverride: (key: string) => void
}

export const useDesktopCustomization = create<DesktopCustomizationStore>()(
  persist(
    (set) => ({
      overrides: {},
      setOverride: (key, override) =>
        set((state) => ({
          overrides: { ...state.overrides, [key]: { ...state.overrides[key], ...override } },
        })),
      removeOverride: (key) =>
        set((state) => {
          const { [key]: _, ...rest } = state.overrides
          return { overrides: rest }
        }),
    }),
    { name: 'tabletop-desktop-customization' },
  ),
)
