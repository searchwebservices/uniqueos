import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DesktopAppsStore {
  /** App IDs pinned to the desktop surface */
  pinnedAppIds: string[]
  /** Whether the My Apps launcher overlay is open */
  launcherOpen: boolean

  addApp: (appId: string) => void
  removeApp: (appId: string) => void
  hasApp: (appId: string) => boolean
  toggleLauncher: () => void
  openLauncher: () => void
  closeLauncher: () => void
}

export const useDesktopApps = create<DesktopAppsStore>()(
  persist(
    (set, get) => ({
      pinnedAppIds: [],
      launcherOpen: false,

      addApp: (appId) =>
        set((state) => {
          if (state.pinnedAppIds.includes(appId)) return state
          return { pinnedAppIds: [...state.pinnedAppIds, appId] }
        }),

      removeApp: (appId) =>
        set((state) => ({
          pinnedAppIds: state.pinnedAppIds.filter((id) => id !== appId),
        })),

      hasApp: (appId) => get().pinnedAppIds.includes(appId),

      toggleLauncher: () => set((state) => ({ launcherOpen: !state.launcherOpen })),
      openLauncher: () => set({ launcherOpen: true }),
      closeLauncher: () => set({ launcherOpen: false }),
    }),
    {
      name: 'tabletop-desktop-apps',
      partialize: (state) => ({ pinnedAppIds: state.pinnedAppIds }),
    },
  ),
)
