import { LayoutGrid, Image, MessageSquare, FolderPlus, AppWindow, ExternalLink } from 'lucide-react'
import { useWindowStore } from '@/stores/window-store'
import { useDesktopApps } from '@/stores/desktop-apps-store'

interface Props {
  x: number
  y: number
  onClose: () => void
  onAddWidget: () => void
  onAddWhatsAppShortcut?: () => void
  onNewFolder?: () => void
  onNewPageShortcut?: () => void
}

export function DesktopContextMenu({ x, y, onClose, onAddWidget, onAddWhatsAppShortcut, onNewFolder, onNewPageShortcut }: Props) {
  const openWindow = useWindowStore((s) => s.openWindow)
  const openLauncher = useDesktopApps((s) => s.openLauncher)

  function handleAddWidget() {
    onAddWidget()
    onClose()
  }

  function handleChangeWallpaper() {
    openWindow('settings')
    onClose()
  }

  function handleAddApp() {
    openLauncher()
    onClose()
  }

  const items = [
    { label: 'Agregar app', icon: AppWindow, action: handleAddApp },
    { label: 'Nueva carpeta', icon: FolderPlus, action: () => { onNewFolder?.(); onClose() } },
    { label: 'Atajo de página', icon: ExternalLink, action: () => { onNewPageShortcut?.(); onClose() } },
    { label: 'Agregar widget', icon: LayoutGrid, action: handleAddWidget },
    { label: 'Cambiar fondo', icon: Image, action: handleChangeWallpaper },
    { label: 'Atajo de WhatsApp', icon: MessageSquare, action: () => { onAddWhatsAppShortcut?.(); onClose() } },
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
