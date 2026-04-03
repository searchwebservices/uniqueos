import { useState, useCallback, useEffect, useRef, Suspense } from 'react'
import { GripHorizontal, X, Trash2, ExternalLink } from 'lucide-react'
import { useWidgetStore } from '@/stores/widget-store'
import { useWindowStore } from '@/stores/window-store'
import { getWidgetType } from './registry'
import type { WidgetInstance } from '@/types/os'

interface Props {
  widget: WidgetInstance
}

export function WidgetFrame({ widget }: Props) {
  const removeWidget = useWidgetStore((s) => s.removeWidget)
  const openWindow = useWindowStore((s) => s.openWindow)
  const [hovered, setHovered] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const entry = getWidgetType(widget.type)
  if (!entry) return null

  const WidgetComponent = entry.component

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  // Close context menu on click outside or Escape
  useEffect(() => {
    if (!contextMenu) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return
      setContextMenu(null)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null)
    }
    window.addEventListener('mousedown', handleClick)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('mousedown', handleClick)
      window.removeEventListener('keydown', handleKey)
    }
  }, [contextMenu])

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      data-widget-frame
      style={{
        pointerEvents: 'auto',
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onContextMenu={handleContextMenu}
    >
      {/* Drag handle bar */}
      <div
        className="widget-drag-handle flex items-center justify-between px-2 shrink-0"
        style={{
          height: 28,
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <GripHorizontal
            size={12}
            className="text-[var(--color-text-tertiary)]"
          />
          <span
            className="text-[11px] font-medium select-none"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {entry.title}
          </span>
        </div>

        <button
          onClick={() => removeWidget(widget.id)}
          className="flex items-center justify-center w-5 h-5 rounded-[var(--radius-sm)] transition-colors"
          style={{
            opacity: hovered ? 1 : 0,
            background: hovered ? 'var(--color-bg-tertiary)' : 'transparent',
            color: 'var(--color-text-tertiary)',
          }}
          aria-label="Remove widget"
        >
          <X size={12} />
        </button>
      </div>

      {/* Widget content */}
      <div className="flex-1 min-h-0 overflow-auto p-2">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <WidgetComponent widgetId={widget.id} config={widget.config} />
        </Suspense>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <WidgetContextMenu
          ref={menuRef}
          x={contextMenu.x}
          y={contextMenu.y}
          widgetTitle={entry.title}
          associatedApp={entry.associatedApp}
          onRemove={() => {
            removeWidget(widget.id)
            setContextMenu(null)
          }}
          onOpenApp={
            entry.associatedApp
              ? () => {
                  openWindow(entry.associatedApp!)
                  setContextMenu(null)
                }
              : undefined
          }
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}

// ── Widget Context Menu ──

import { forwardRef } from 'react'

interface WidgetContextMenuProps {
  x: number
  y: number
  widgetTitle: string
  associatedApp?: string
  onRemove: () => void
  onOpenApp?: () => void
  onClose: () => void
}

const WidgetContextMenu = forwardRef<HTMLDivElement, WidgetContextMenuProps>(
  ({ x, y, widgetTitle, onRemove, onOpenApp, onClose }, ref) => {
    // Adjust position to stay in viewport
    const adjustedX = Math.min(x, window.innerWidth - 200)
    const adjustedY = Math.min(y, window.innerHeight - 150)

    const items: { label: string; icon: typeof Trash2; action: () => void; danger?: boolean }[] = []

    if (onOpenApp) {
      items.push({
        label: `Abrir ${widgetTitle}`,
        icon: ExternalLink,
        action: onOpenApp,
      })
    }

    items.push({
      label: 'Quitar widget',
      icon: Trash2,
      action: onRemove,
      danger: true,
    })

    return (
      <>
        {/* Invisible overlay */}
        <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={onClose} />

        <div
          ref={ref}
          className="fixed py-1"
          style={{
            left: adjustedX,
            top: adjustedY,
            zIndex: 9999,
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            minWidth: 160,
          }}
        >
          {items.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors hover:bg-[var(--color-bg-tertiary)]"
              >
                <Icon
                  size={13}
                  className="shrink-0"
                  style={{
                    color: item.danger ? 'var(--color-error)' : 'var(--color-text-tertiary)',
                  }}
                />
                <span
                  className="text-[12px]"
                  style={{
                    color: item.danger ? 'var(--color-error)' : 'var(--color-text-primary)',
                  }}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </>
    )
  },
)

WidgetContextMenu.displayName = 'WidgetContextMenu'
