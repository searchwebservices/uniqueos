import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeMode } from '@/types/os'

interface ThemeStore {
  mode: ThemeMode
  wallpaper: string
  accentColor: string

  setMode: (mode: ThemeMode) => void
  setWallpaper: (path: string) => void
  setAccentColor: (color: string) => void
  getResolvedTheme: () => 'light' | 'dark'
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'system',
      wallpaper: 'default',
      accentColor: '#b87a4b',

      setMode: (mode) => set({ mode }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setAccentColor: (accentColor) => set({ accentColor }),

      getResolvedTheme: () => {
        const { mode } = get()
        if (mode === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return mode
      },
    }),
    { name: 'tabletop-theme' }
  )
)
