import { LayoutGrid, Image, MessageSquare } from 'lucide-react'
import { useWindowStore } from '@/stores/window-store'

interface Props {
  x: number
  y: number
  onClose: () => void
  onAddWidget: () => void
  onAddWhatsAppShortcut?: () => void
}

export function DesktopContextMenu({ x, y, onClose, onAddWidget, onAddWhatsAppShortcut }: Props) {
  const openWindow = useWindowStore((s) => s.openWindow)

  function handleAddWidget() {
    onAddWidget()
    onClose()
  }

  function handleChangeWallpaper() {
    openWindow('settings')
    onClose()
  }

  const items = [
    { label: 'Add widget', icon: LayoutGrid, action: handleAddWidget },
    { label: 'Change wallpaper', icon: Image, action: handleChangeWallpaper },
    { label: 'New WhatsApp shortcut', icon: MessageSquare, action: () => { onAddWhatsAppShortcut?.(); onClose() } },
  ]

  return (
    <>
      {/* Invisible overlay to catch clicks outside */}
      <div className="fixed inset-0" style={{ zIndex: 49 }} onClick={onClose} />

      <div
        className="fixed py-1"
        style={{
          left: x,
          top: y,
          zIndex: 50,
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          minWidth: 180,
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
                size={14}
                className="text-[var(--color-text-tertiary)] shrink-0"
              />
              <span
                className="text-[12px]"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}
