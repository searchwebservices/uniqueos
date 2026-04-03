import { useRef, useCallback, useState } from 'react'
import { Rnd } from 'react-rnd'
import { Minus, Square, X } from 'lucide-react'
import { useWindowStore } from '@/stores/window-store'
import { getApp } from '@/lib/app-registry'
import { WindowContent } from './WindowContent'
import { cn } from '@/lib/cn'
import type { OSWindow } from '@/types/os'

interface Props {
  window: OSWindow
}

export function WindowFrame({ window: win }: Props) {
  const app = getApp(win.appId)
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    moveWindow,
    resizeWindow,
    focusedWindowId,
    snapWindow,
  } = useWindowStore()

  const [snapZone, setSnapZone] = useState<'left' | 'right' | 'top' | null>(null)
  const rndRef = useRef<Rnd>(null)
  const isFocused = focusedWindowId === win.id

  const isMaximized = win.state === 'maximized'
  const isSnapped = win.state === 'snapped-left' || win.state === 'snapped-right'

  // Compute display position/size for maximized/snapped
  const displayPosition = isMaximized
    ? { x: 0, y: 0 }
    : win.state === 'snapped-left'
    ? { x: 0, y: 0 }
    : win.state === 'snapped-right'
    ? { x: Math.round(window.innerWidth / 2), y: 0 }
    : win.position

  const displaySize = isMaximized
    ? { width: window.innerWidth, height: window.innerHeight - 36 - 64 }
    : isSnapped
    ? { width: Math.round(window.innerWidth / 2), height: window.innerHeight - 36 - 64 }
    : win.size

  const handleMouseDown = useCallback(() => {
    if (!isFocused) focusWindow(win.id)
  }, [isFocused, focusWindow, win.id])

  const handleDragStop = useCallback((_e: unknown, d: { x: number; y: number }) => {
    if (snapZone === 'left') {
      snapWindow(win.id, 'left')
    } else if (snapZone === 'right') {
      snapWindow(win.id, 'right')
    } else if (snapZone === 'top') {
      maximizeWindow(win.id)
    } else {
      // If previously snapped or maximized, restore first
      if (isSnapped || isMaximized) {
        restoreWindow(win.id)
      }
      moveWindow(win.id, { x: d.x, y: d.y })
    }
    setSnapZone(null)
  }, [snapZone, win.id, snapWindow, maximizeWindow, restoreWindow, moveWindow, isSnapped, isMaximized])

  const handleDrag = useCallback((_e: unknown, d: { x: number; y: number }) => {
    const threshold = 20
    if (d.x < threshold) {
      setSnapZone('left')
    } else if (d.x + displaySize.width > window.innerWidth - threshold) {
      setSnapZone('right')
    } else if (d.y < threshold) {
      setSnapZone('top')
    } else {
      setSnapZone(null)
    }
  }, [displaySize.width])

  const handleResizeStop = useCallback(
    (_e: unknown, _dir: unknown, ref: HTMLElement, _delta: unknown, position: { x: number; y: number }) => {
      resizeWindow(win.id, position, {
        width: ref.offsetWidth,
        height: ref.offsetHeight,
      })
    },
    [resizeWindow, win.id]
  )

  const handleTitleBarDoubleClick = useCallback(() => {
    if (isMaximized) {
      restoreWindow(win.id)
    } else {
      maximizeWindow(win.id)
    }
  }, [isMaximized, restoreWindow, maximizeWindow, win.id])

  if (!app) return null

  const Icon = app.icon

  return (
    <Rnd
      ref={rndRef}
      position={displayPosition}
      size={displaySize}
      minWidth={app.minSize.width}
      minHeight={app.minSize.height}
      dragHandleClassName="window-titlebar"
      bounds="parent"
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      enableResizing={win.state === 'normal'}
      disableDragging={win.state !== 'normal' && win.state !== 'maximized' && win.state !== 'snapped-left' && win.state !== 'snapped-right'}
      style={{ zIndex: win.zIndex, pointerEvents: 'auto' }}
      onMouseDown={handleMouseDown}
      className={cn(
        'flex flex-col rounded-[var(--radius-lg)] overflow-hidden',
        'border border-[var(--color-window-border)]',
        isFocused ? 'shadow-[var(--shadow-window)]' : 'shadow-[var(--shadow-md)]'
      )}
    >
      {/* Title bar */}
      <div
        className={cn(
          'window-titlebar flex items-center h-9 px-3 gap-2 shrink-0 select-none',
          isFocused
            ? 'bg-[var(--color-window-titlebar)]'
            : 'bg-[var(--color-window-titlebar-inactive)]'
        )}
        onDoubleClick={handleTitleBarDoubleClick}
      >
        <Icon size={14} className="shrink-0 text-[var(--color-text-secondary)]" />
        <span className="flex-1 text-xs font-medium truncate text-[var(--color-window-titlebar-text)]">
          {win.title}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id) }}
            className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            aria-label="Minimize"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id)
            }}
            className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square size={10} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id) }}
            className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-error)] hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto bg-[var(--color-window-bg)]">
        <WindowContent window={win} app={app} />
      </div>
    </Rnd>
  )
}
