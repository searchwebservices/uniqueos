import { create } from 'zustand'
import type { OSWindow, WindowState } from '@/types/os'
import { getApp } from '@/lib/app-registry'

interface WindowStore {
  windows: OSWindow[]
  focusedWindowId: string | null
  nextZIndex: number

  openWindow: (appId: string, meta?: Record<string, unknown>) => void
  closeWindow: (windowId: string) => void
  focusWindow: (windowId: string) => void
  minimizeWindow: (windowId: string) => void
  maximizeWindow: (windowId: string) => void
  restoreWindow: (windowId: string) => void
  snapWindow: (windowId: string, side: 'left' | 'right') => void
  moveWindow: (windowId: string, position: { x: number; y: number }) => void
  resizeWindow: (windowId: string, position: { x: number; y: number }, size: { width: number; height: number }) => void
  setTitle: (windowId: string, title: string) => void
  getWindowsByWorkspace: (workspaceId: string) => OSWindow[]
}

const Z_INDEX_THRESHOLD = 500

function normalizeZIndexes(windows: OSWindow[]): OSWindow[] {
  if (windows.length === 0) return windows
  const maxZ = Math.max(...windows.map(w => w.zIndex))
  if (maxZ <= Z_INDEX_THRESHOLD) return windows

  const sorted = [...windows].sort((a, b) => a.zIndex - b.zIndex)
  return sorted.map((w, i) => ({ ...w, zIndex: 100 + i }))
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  focusedWindowId: null,
  nextZIndex: 100,

  openWindow: (appId, meta) => {
    const app = getApp(appId)
    if (!app) return

    // Singleton enforcement
    if (app.singleton) {
      const existing = get().windows.find(w => w.appId === appId)
      if (existing) {
        get().focusWindow(existing.id)
        return
      }
    }

    const id = `win-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const initialRoute = app.buildRoute(meta)
    const workspaceId = 'default' // Will read from workspace store later

    // Center the window
    const x = Math.max(40, Math.round((window.innerWidth - app.defaultSize.width) / 2) + Math.random() * 40 - 20)
    const y = Math.max(50, Math.round((window.innerHeight - app.defaultSize.height) / 2) + Math.random() * 40 - 20)

    const newWindow: OSWindow = {
      id,
      appId,
      title: app.title,
      state: 'normal',
      zIndex: get().nextZIndex,
      position: { x, y },
      size: { ...app.defaultSize },
      workspaceId,
      initialRoute,
      meta,
    }

    set(state => {
      const windows = normalizeZIndexes([...state.windows, newWindow])
      return {
        windows,
        focusedWindowId: id,
        nextZIndex: Math.max(...windows.map(w => w.zIndex)) + 1,
      }
    })
  },

  closeWindow: (windowId) => {
    set(state => {
      const windows = state.windows.filter(w => w.id !== windowId)
      const focusedWindowId = state.focusedWindowId === windowId
        ? windows.filter(w => w.state !== 'minimized').sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
        : state.focusedWindowId
      return { windows, focusedWindowId }
    })
  },

  focusWindow: (windowId) => {
    set(state => {
      const win = state.windows.find(w => w.id === windowId)
      if (!win) return state

      let windows = state.windows.map(w =>
        w.id === windowId
          ? { ...w, zIndex: state.nextZIndex, state: w.state === 'minimized' ? 'normal' as WindowState : w.state }
          : w
      )
      windows = normalizeZIndexes(windows)

      return {
        windows,
        focusedWindowId: windowId,
        nextZIndex: Math.max(...windows.map(w => w.zIndex)) + 1,
      }
    })
  },

  minimizeWindow: (windowId) => {
    set(state => {
      const windows = state.windows.map(w =>
        w.id === windowId ? { ...w, state: 'minimized' as WindowState } : w
      )
      const focusedWindowId = state.focusedWindowId === windowId
        ? windows.filter(w => w.state !== 'minimized').sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
        : state.focusedWindowId
      return { windows, focusedWindowId }
    })
  },

  maximizeWindow: (windowId) => {
    set(state => ({
      windows: state.windows.map(w => {
        if (w.id !== windowId) return w
        if (w.state === 'maximized') return w
        return {
          ...w,
          state: 'maximized' as WindowState,
          restoreRect: { ...w.position, ...w.size },
        }
      }),
    }))
  },

  restoreWindow: (windowId) => {
    set(state => ({
      windows: state.windows.map(w => {
        if (w.id !== windowId) return w
        if (!w.restoreRect) return { ...w, state: 'normal' as WindowState }
        return {
          ...w,
          state: 'normal' as WindowState,
          position: { x: w.restoreRect.x, y: w.restoreRect.y },
          size: { width: w.restoreRect.width, height: w.restoreRect.height },
          restoreRect: undefined,
        }
      }),
    }))
  },

  snapWindow: (windowId, side) => {
    set(state => ({
      windows: state.windows.map(w => {
        if (w.id !== windowId) return w
        const snapState = side === 'left' ? 'snapped-left' : 'snapped-right'
        return {
          ...w,
          state: snapState as WindowState,
          restoreRect: w.state === 'normal' ? { ...w.position, ...w.size } : w.restoreRect,
        }
      }),
    }))
  },

  moveWindow: (windowId, position) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, position } : w
      ),
    }))
  },

  resizeWindow: (windowId, position, size) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, position, size } : w
      ),
    }))
  },

  setTitle: (windowId, title) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, title } : w
      ),
    }))
  },

  getWindowsByWorkspace: (workspaceId) => {
    return get().windows.filter(w => w.workspaceId === workspaceId)
  },
}))
