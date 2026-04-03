import { useState } from 'react'
import { getApp } from '@/lib/app-registry'
import { useWindowStore } from '@/stores/window-store'
import { useDockStore } from '@/stores/dock-store'
import { cn } from '@/lib/cn'

interface Props {
  appId: string
}

export function DockItem({ appId }: Props) {
  const app = getApp(appId)
  const openWindow = useWindowStore(s => s.openWindow)
  const windows = useWindowStore(s => s.windows)
  const focusWindow = useWindowStore(s => s.focusWindow)
  const focusedWindowId = useWindowStore(s => s.focusedWindowId)
  const badge = useDockStore(s => s.badges[appId])
  const [showTooltip, setShowTooltip] = useState(false)

  if (!app) return null

  const Icon = app.icon
  const appWindows = windows.filter(w => w.appId === appId)
  const isRunning = appWindows.length > 0
  const hasMinimized = appWindows.some(w => w.state === 'minimized')

  const handleClick = () => {
    if (appWindows.length === 0) {
      // No windows — open a new one
      openWindow(appId)
      return
    }

    if (app.singleton) {
      // Singleton — focus the one window (restores if minimized via focusWindow)
      focusWindow(appWindows[0].id)
      return
    }

    // Multi-window app: cycle through windows
    // If there's a minimized one that isn't focused, restore it
    if (hasMinimized) {
      const minimized = appWindows.find(w => w.state === 'minimized')
      if (minimized) {
        focusWindow(minimized.id)
        return
      }
    }

    // Cycle: find the focused one, go to next
    const focusedIdx = appWindows.findIndex(w => w.id === focusedWindowId)
    if (focusedIdx >= 0 && appWindows.length > 1) {
      const nextIdx = (focusedIdx + 1) % appWindows.length
      focusWindow(appWindows[nextIdx].id)
    } else {
      // Not currently focused — focus the topmost
      const topmost = [...appWindows].sort((a, b) => b.zIndex - a.zIndex)[0]
      focusWindow(topmost.id)
    }
  }

  return (
    <div className="relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-[var(--radius-sm)] text-[10px] font-medium whitespace-nowrap pointer-events-none"
          style={{
            background: 'var(--color-text-primary)',
            color: 'var(--color-text-inverse)',
          }}
        >
          {app.title}
          {appWindows.length > 1 && ` (${appWindows.length})`}
        </div>
      )}

      {/* Icon button */}
      <button
        onClick={handleClick}
        className={cn(
          'relative w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)]',
          'hover:bg-[var(--color-bg-tertiary)] active:scale-95',
          'transition-all duration-100'
        )}
        aria-label={`Open ${app.title}`}
      >
        <Icon size={22} className="text-[var(--color-text-primary)]" />

        {/* Badge */}
        {badge && badge > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--color-accent)] text-[8px] font-medium text-[var(--color-text-inverse)] flex items-center justify-center">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>

      {/* Running indicator dot(s) */}
      {isRunning && (
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
          {appWindows.length === 1 ? (
            <div className="w-1 h-1 rounded-full bg-[var(--color-text-secondary)]" />
          ) : (
            // Multiple windows — show multiple dots (max 3)
            Array.from({ length: Math.min(appWindows.length, 3) }).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-[var(--color-text-secondary)]" />
            ))
          )}
        </div>
      )}
    </div>
  )
}
