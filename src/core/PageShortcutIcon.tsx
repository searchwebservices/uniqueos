import { useCallback, useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import { useWindowStore } from '@/stores/window-store'
import { getApp } from '@/lib/app-registry'
import type { PageShortcut } from '@/stores/page-shortcuts-store'

interface Props {
  shortcut: PageShortcut
}

export function PageShortcutIcon({ shortcut }: Props) {
  const openWindow = useWindowStore((s) => s.openWindow)
  const lastClickRef = useRef(0)

  const app = getApp(shortcut.appId)

  const handleOpen = useCallback(() => {
    openWindow(shortcut.appId, shortcut.meta)
  }, [openWindow, shortcut.appId, shortcut.meta])

  const handleClick = useCallback(() => {
    const now = Date.now()
    if (now - lastClickRef.current < 400) {
      handleOpen()
    }
    lastClickRef.current = now
  }, [handleOpen])

  const AppIcon = app?.icon

  return (
    <button
      onClick={handleClick}
      onDoubleClick={handleOpen}
      className="flex flex-col items-center gap-1 w-16 p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-desktop-icon-bg)] transition-colors select-none"
      aria-label={`Open ${shortcut.name}`}
    >
      <div className="relative">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] text-white"
          style={{ background: `${shortcut.color}20`, border: `1px solid ${shortcut.color}40` }}
        >
          {AppIcon ? (
            <AppIcon size={20} style={{ color: shortcut.color }} />
          ) : (
            <ExternalLink size={20} style={{ color: shortcut.color }} />
          )}
        </div>

        {/* Link badge */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{
            background: shortcut.color,
            border: '1.5px solid var(--color-bg-primary)',
          }}
        >
          <ExternalLink size={8} color="white" />
        </div>
      </div>

      <span
        className="text-[10px] text-center leading-tight line-clamp-2"
        style={{
          color: 'var(--color-desktop-text-secondary)',
          textShadow: 'var(--desktop-text-shadow)',
        }}
      >
        {shortcut.name}
      </span>
    </button>
  )
}
