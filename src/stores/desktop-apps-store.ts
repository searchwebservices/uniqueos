import { create } from 'zustand'

interface DesktopAppsStore {
  launcherOpen: boolean
  toggleLauncher: () => void
  openLauncher: () => void
  closeLauncher: () => void
}

export const useDesktopApps = create<DesktopAppsStore>()((set) => ({
  launcherOpen: false,
  toggleLauncher: () => set((state) => ({ launcherOpen: !state.launcherOpen })),
  openLauncher: () => set({ launcherOpen: true }),
  closeLauncher: () => set({ launcherOpen: false }),
}))
