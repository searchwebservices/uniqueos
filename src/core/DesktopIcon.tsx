import { useCallback, useRef } from 'react'
import { useWindowStore } from '@/stores/window-store'
import type { AppRegistryEntry } from '@/types/os'

interface Props {
  app: AppRegistryEntry
}

export function DesktopIcon({ app }: Props) {
  const openWindow = useWindowStore(s => s.openWindow)
  const lastClickRef = useRef(0)

  const handleDoubleClick = useCallback(() => {
    openWindow(app.appId)
  }, [openWindow, app.appId])

  // Manual double-click detection for touch devices
  const handleClick = useCallback(() => {
    const now = Date.now()
    if (now - lastClickRef.current < 400) {
      handleDoubleClick()
    }
    lastClickRef.current = now
  }, [handleDoubleClick])

  const Icon = app.icon

  return (
    <button
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className="flex flex-col items-center gap-1 w-16 p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-tertiary)] transition-colors select-none"
      aria-label={`Open ${app.title}`}
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]">
        <Icon size={20} className="text-[var(--color-text-primary)]" />
      </div>
      <span className="text-[10px] text-[var(--color-text-secondary)] text-center leading-tight line-clamp-2">
        {app.title}
      </span>
    </button>
  )
}
