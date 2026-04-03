import { useCallback, useRef, useState } from 'react'
import { useWindowStore } from '@/stores/window-store'
import { useDesktopSelection } from '@/stores/desktop-selection-store'
import { useDesktopCustomization } from '@/stores/desktop-customization-store'
import { resolveIcon } from '@/lib/icon-library'
import type { AppRegistryEntry } from '@/types/os'
import { cn } from '@/lib/cn'
import { DesktopIconContextMenu } from './DesktopIconContextMenu'

interface Props {
  app: AppRegistryEntry
  onEdit?: (key: string) => void
}

export function DesktopIcon({ app, onEdit }: Props) {
  const openWindow = useWindowStore((s) => s.openWindow)
  const selected = useDesktopSelection((s) => s.selected)
  const select = useDesktopSelection((s) => s.select)
  const toggleSelect = useDesktopSelection((s) => s.toggleSelect)
  const lastClickRef = useRef(0)

  const itemKey = `app:${app.appId}`
  const override = useDesktopCustomization((s) => s.overrides[itemKey])
  const isSelected = selected.some((s) => s.type === 'app' && s.id === app.appId)

  const displayName = override?.name ?? app.title
  const displayColor = override?.color
  const DisplayIcon = (override?.iconKey ? resolveIcon(override.iconKey) : null) ?? app.icon

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      const now = Date.now()
      if (now - lastClickRef.current < 400) {
        openWindow(app.appId)
      } else if (e.shiftKey || e.metaKey) {
        toggleSelect('app', app.appId)
      } else {
        select('app', app.appId)
      }
      lastClickRef.current = now
    },
    [openWindow, select, toggleSelect, app.appId],
  )

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      openWindow(app.appId)
    },
    [openWindow, app.appId],
  )

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      select('app', app.appId)
      setContextMenu({ x: e.clientX, y: e.clientY })
    },
    [select, app.appId],
  )

  return (
    <>
      <button
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        className={cn(
          'flex flex-col items-center gap-1 w-full h-full p-1.5 rounded-[var(--radius-md)] transition-colors select-none',
          isSelected
            ? 'bg-[var(--color-accent-subtle)] ring-1 ring-[var(--color-accent)]'
            : 'hover:bg-[var(--color-desktop-icon-bg)]',
        )}
        aria-label={`Open ${displayName}`}
      >
        <div
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] border transition-colors',
            isSelected
              ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)]'
              : '',
          )}
          style={
            !isSelected && displayColor
              ? { background: `${displayColor}20`, borderColor: `${displayColor}40` }
              : !isSelected
                ? { background: 'var(--color-desktop-icon-bg)', borderColor: 'transparent' }
                : undefined
          }
        >
          <DisplayIcon
            size={20}
            style={{
              color: isSelected
                ? 'var(--color-accent)'
                : displayColor ?? 'var(--color-desktop-text)',
            }}
          />
        </div>
        <span
          className="text-[10px] text-center leading-tight line-clamp-2 w-full"
          style={{
            color: isSelected ? 'var(--color-accent)' : 'var(--color-desktop-text-secondary)',
            fontWeight: isSelected ? 500 : 400,
            textShadow: isSelected ? 'none' : 'var(--desktop-text-shadow)',
          }}
        >
          {displayName}
        </span>
      </button>

      {contextMenu && (
        <DesktopIconContextMenu
          app={app}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onEdit={onEdit ? () => { onEdit(itemKey); setContextMenu(null) } : undefined}
        />
      )}
    </>
  )
}
