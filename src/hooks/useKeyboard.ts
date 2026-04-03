import { useEffect } from 'react'
import { useCommandPaletteStore } from '@/stores/command-palette-store'
import { useWindowStore } from '@/stores/window-store'

export function useKeyboard() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey

      // Cmd+K — Toggle command palette
      if (isMeta && e.key === 'k') {
        e.preventDefault()
        useCommandPaletteStore.getState().toggle()
        return
      }

      // Cmd+W — Close focused window
      if (isMeta && e.key === 'w') {
        e.preventDefault()
        const { focusedWindowId, closeWindow } = useWindowStore.getState()
        if (focusedWindowId) {
          closeWindow(focusedWindowId)
        }
        return
      }

      // Cmd+N — Open most recently used app (or command palette as fallback)
      if (isMeta && !e.shiftKey && e.key === 'n') {
        e.preventDefault()
        useCommandPaletteStore.getState().open()
        return
      }

      // Cmd+Shift+N — Quick note
      if (isMeta && e.shiftKey && e.key === 'N') {
        e.preventDefault()
        useWindowStore.getState().openWindow('notes')
        return
      }

      // Cmd+, — Open Settings
      if (isMeta && e.key === ',') {
        e.preventDefault()
        useWindowStore.getState().openWindow('settings')
        return
      }

      // Alt+Tab or Cmd+Tab — Cycle through open windows
      if (e.key === 'Tab' && (e.altKey || e.metaKey)) {
        e.preventDefault()
        const { windows, focusedWindowId, focusWindow } = useWindowStore.getState()
        const visible = windows.filter(w => w.state !== 'minimized')
        if (visible.length < 2) return

        const sorted = [...visible].sort((a, b) => a.zIndex - b.zIndex)
        const currentIdx = sorted.findIndex(w => w.id === focusedWindowId)
        const nextIdx = e.shiftKey
          ? (currentIdx - 1 + sorted.length) % sorted.length
          : (currentIdx + 1) % sorted.length
        focusWindow(sorted[nextIdx].id)
        return
      }

      // Escape — Close command palette
      if (e.key === 'Escape') {
        const palette = useCommandPaletteStore.getState()
        if (palette.isOpen) {
          palette.close()
          return
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
