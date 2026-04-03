import { ExternalLink, Pin, Phone, Trash2, Folder, Pencil, X, Layers, XCircle } from 'lucide-react'
import { useDesktopSelection } from '@/stores/desktop-selection-store'
import { useWindowStore } from '@/stores/window-store'
import { useDockStore } from '@/stores/dock-store'
import { useDesktopApps } from '@/stores/desktop-apps-store'
import { useDesktopLayout } from '@/stores/desktop-layout-store'
import { useWhatsAppShortcuts } from '@/hooks/useWhatsAppShortcuts'
import { useFolders } from '@/hooks/useFolders'
import { getApp } from '@/lib/app-registry'

interface ActionBarProps {
  onEdit?: (key: string) => void
}

export function AppActionBar({ onEdit }: ActionBarProps) {
  const selected = useDesktopSelection((s) => s.selected)

  if (selected.length === 0) return null
  if (selected.length === 1) {
    const item = selected[0]
    if (item.type === 'app') return <AppBar appId={item.id} onEdit={onEdit} />
    if (item.type === 'shortcut') return <ShortcutBar shortcutId={item.id} onEdit={onEdit} />
    if (item.type === 'folder') return <FolderBar folderId={item.id} />
    return null
  }

  return <BatchBar count={selected.length} />
}

function BatchBar({ count }: { count: number }) {
  const deselect = useDesktopSelection((s) => s.deselect)
  const selected = useDesktopSelection((s) => s.selected)
  const openWindow = useWindowStore((s) => s.openWindow)

  const handleOpenAll = () => {
    for (const item of selected) {
      if (item.type === 'app') {
        openWindow(item.id)
      } else if (item.type === 'shortcut') {
        // WhatsApp shortcuts open externally — skip in batch for now
      }
    }
    deselect()
  }

  return (
    <ActionBarShell
      icon={<Layers size={14} className="text-[var(--color-accent)]" />}
      label={`${count} items`}
    >
      <ActionButton icon={ExternalLink} label="Open All" onClick={handleOpenAll} />
    </ActionBarShell>
  )
}

function AppBar({ appId, onEdit }: { appId: string; onEdit?: (key: string) => void }) {
  const deselect = useDesktopSelection((s) => s.deselect)
  const openWindow = useWindowStore((s) => s.openWindow)
  const dockItems = useDockStore((s) => s.items)
  const addItem = useDockStore((s) => s.addItem)
  const removeItem = useDockStore((s) => s.removeItem)
  const removeApp = useDesktopApps((s) => s.removeApp)
  const removePosition = useDesktopLayout((s) => s.removePosition)

  const app = getApp(appId)
  if (!app) return null

  const isInDock = dockItems.some((d) => d.appId === app.appId)
  const Icon = app.icon

  return (
    <ActionBarShell
      icon={<Icon size={14} className="text-[var(--color-accent)]" />}
      label={app.title}
    >
      <ActionButton
        icon={ExternalLink}
        label="Open"
        onClick={() => {
          openWindow(app.appId)
          deselect()
        }}
      />
      <ActionButton
        icon={Pin}
        label={isInDock ? 'Unpin' : 'Pin'}
        onClick={() => {
          isInDock ? removeItem(app.appId) : addItem(app.appId)
        }}
      />
      {onEdit && (
        <ActionButton
          icon={Pencil}
          label="Edit"
          onClick={() => onEdit(`app:${app.appId}`)}
        />
      )}
      <ActionButton
        icon={XCircle}
        label="Remove"
        onClick={() => {
          removeApp(app.appId)
          removePosition(`app:${app.appId}`)
          deselect()
        }}
      />
    </ActionBarShell>
  )
}

function ShortcutBar({ shortcutId, onEdit }: { shortcutId: string; onEdit?: (key: string) => void }) {
  const deselect = useDesktopSelection((s) => s.deselect)
  const { shortcuts, deleteShortcut } = useWhatsAppShortcuts()
  const shortcut = shortcuts.find((s) => s.id === shortcutId)

  if (!shortcut) return null

  const handleOpen = () => {
    if (shortcut.type === 'direct' && shortcut.phone_number) {
      window.open(`https://wa.me/${shortcut.phone_number.replace(/[^\d]/g, '')}`, '_blank')
    } else if (shortcut.type === 'group' && shortcut.group_invite_code) {
      window.open(`https://chat.whatsapp.com/${shortcut.group_invite_code}`, '_blank')
    }
    deselect()
  }

  return (
    <ActionBarShell
      icon={<Phone size={14} color="#25D366" />}
      label={shortcut.name}
    >
      <ActionButton icon={ExternalLink} label="Open" onClick={handleOpen} />
      {onEdit && (
        <ActionButton
          icon={Pencil}
          label="Edit"
          onClick={() => onEdit(`shortcut:${shortcut.id}`)}
        />
      )}
      <ActionButton
        icon={Trash2}
        label="Remove"
        onClick={() => {
          deleteShortcut.mutate(shortcut.id)
          deselect()
        }}
        danger
      />
    </ActionBarShell>
  )
}

function FolderBar({ folderId }: { folderId: string }) {
  const deselect = useDesktopSelection((s) => s.deselect)
  const { folders, deleteFolder } = useFolders()
  const folder = folders.find((f) => f.id === folderId)

  if (!folder) return null

  return (
    <ActionBarShell
      icon={<Folder size={14} className="text-[var(--color-accent)]" />}
      label={folder.name}
    >
      <ActionButton
        icon={ExternalLink}
        label="Open"
        onClick={() => deselect()}
      />
      <ActionButton
        icon={Trash2}
        label="Delete"
        onClick={() => {
          deleteFolder.mutate(folder.id)
          deselect()
        }}
        danger
      />
    </ActionBarShell>
  )
}

function ActionBarShell({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  const deselect = useDesktopSelection((s) => s.deselect)

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-[var(--radius-lg)] animate-in scale-in duration-200"
      style={{
        bottom: 'calc(var(--dock-height) + 12px)',
        zIndex: 1001,
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
        pointerEvents: 'auto',
      }}
    >
      <div
        className="flex items-center gap-2 pr-3 border-r"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <div
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)]"
          style={{ background: 'var(--color-accent-subtle)' }}
        >
          {icon}
        </div>
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label}
        </span>
      </div>

      <div className="flex items-center gap-1">{children}</div>

      <button
        onClick={deselect}
        className="ml-1 w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
        style={{ color: 'var(--color-text-tertiary)' }}
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof ExternalLink
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] text-xs transition-colors hover:bg-[var(--color-bg-tertiary)]"
      style={{ color: danger ? 'var(--color-error)' : 'var(--color-text-secondary)' }}
    >
      <Icon size={13} />
      {label}
    </button>
  )
}
