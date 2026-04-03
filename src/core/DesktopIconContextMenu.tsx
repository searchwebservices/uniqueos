import { useEffect, useRef } from 'react'
import { ExternalLink, Pin, Pencil, XCircle } from 'lucide-react'
import { useWindowStore } from '@/stores/window-store'
import { useDockStore } from '@/stores/dock-store'
import { useDesktopSelection } from '@/stores/desktop-selection-store'
import { useDesktopApps } from '@/stores/desktop-apps-store'
import { useDesktopLayout } from '@/stores/desktop-layout-store'
import type { AppRegistryEntry } from '@/types/os'

interface Props {
  app: AppRegistryEntry
  x: number
  y: number
  onClose: () => void
  onEdit?: () => void
}

export function DesktopIconContextMenu({ app, x, y, onClose, onEdit }: Props) {
  const openWindow = useWindowStore((s) => s.openWindow)
  const dockItems = useDockStore((s) => s.items)
  const addItem = useDockStore((s) => s.addItem)
  const removeItem = useDockStore((s) => s.removeItem)
  const deselect = useDesktopSelection((s) => s.deselect)
  const removeApp = useDesktopApps((s) => s.removeApp)
  const removePosition = useDesktopLayout((s) => s.removePosition)
  const ref = useRef<HTMLDivElement>(null)

  const isInDock = dockItems.some((d) => d.appId === app.appId)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('mousedown', handle)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('mousedown', handle)
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const items: { label: string; icon: typeof ExternalLink; action: () => void }[] = [
    {
      label: 'Open',
      icon: ExternalLink,
      action: () => {
        openWindow(app.appId)
        deselect()
        onClose()
      },
    },
    {
      label: isInDock ? 'Unpin from Dock' : 'Pin to Dock',
      icon: Pin,
      action: () => {
        if (isInDock) removeItem(app.appId)
        else addItem(app.appId)
        onClose()
      },
    },
  ]

  if (onEdit) {
    items.push({
      label: 'Edit',
      icon: Pencil,
      action: onEdit,
    })
  }

  items.push({
    label: 'Remove from Desktop',
    icon: XCircle,
    action: () => {
      removeApp(app.appId)
      removePosition(`app:${app.appId}`)
      deselect()
      onClose()
    },
  })

  const style: React.CSSProperties = {
    position: 'fixed',
    left: Math.min(x, window.innerWidth - 200),
    top: Math.min(y, window.innerHeight - 200),
    zIndex: 9999,
  }

  return (
    <div ref={ref} style={style}>
      <div
        className="min-w-[160px] py-1 rounded-[var(--radius-md)] animate-in scale-in duration-150"
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors hover:bg-[var(--color-bg-tertiary)]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <item.icon size={13} className="shrink-0" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
