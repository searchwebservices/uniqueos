import { useEffect, useRef } from 'react'
import {
  FolderOpen,
  Pencil,
  FolderInput,
  Globe,
  GlobeLock,
  Download,
  Trash2,
} from 'lucide-react'
import type { DbDriveItem } from '@/types/database'

interface FileContextMenuProps {
  item: DbDriveItem
  position: { x: number; y: number }
  onClose: () => void
  onOpen: () => void
  onRename: () => void
  onMove: () => void
  onPublish: () => void
  onDownload: () => void
  onDelete: () => void
}

interface MenuAction {
  label: string
  icon: typeof FolderOpen
  onClick: () => void
  danger?: boolean
  hidden?: boolean
}

export function FileContextMenu({
  item,
  position,
  onClose,
  onOpen,
  onRename,
  onMove,
  onPublish,
  onDownload,
  onDelete,
}: FileContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // Adjust position so menu doesn't overflow viewport
  const menuWidth = 180
  const menuHeight = 260
  const adjustedX = Math.min(position.x, window.innerWidth - menuWidth - 8)
  const adjustedY = Math.min(position.y, window.innerHeight - menuHeight - 8)

  const actions: MenuAction[] = [
    { label: 'Open', icon: FolderOpen, onClick: onOpen },
    { label: 'Rename', icon: Pencil, onClick: onRename },
    { label: 'Move to...', icon: FolderInput, onClick: onMove },
    {
      label: item.is_published ? 'Unpublish' : 'Publish',
      icon: item.is_published ? GlobeLock : Globe,
      onClick: onPublish,
      hidden: item.type === 'folder',
    },
    {
      label: 'Download',
      icon: Download,
      onClick: onDownload,
      hidden: item.type === 'folder',
    },
    { label: 'Delete', icon: Trash2, onClick: onDelete, danger: true },
  ]

  return (
    <div
      ref={ref}
      className="fixed z-[9999] py-1 rounded-[var(--radius-md)] shadow-lg border min-w-[170px]"
      style={{
        left: adjustedX,
        top: adjustedY,
        background: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border-subtle)',
      }}
    >
      {actions
        .filter((a) => !a.hidden)
        .map((action, i) => (
          <button
            key={action.label}
            onClick={() => {
              action.onClick()
              onClose()
            }}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] transition-colors hover:bg-[var(--color-bg-tertiary)]"
            style={{
              color: action.danger
                ? 'var(--color-error)'
                : 'var(--color-text-primary)',
              ...(i > 0 && actions[i - 1]?.danger !== undefined && action.danger
                ? {
                    borderTop: '1px solid var(--color-border-subtle)',
                    marginTop: '2px',
                    paddingTop: '6px',
                  }
                : {}),
            }}
          >
            <action.icon size={13} />
            {action.label}
          </button>
        ))}
    </div>
  )
}
