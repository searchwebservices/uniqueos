import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Folder,
  MessageCircle,
  FileText,
  Briefcase,
  Image,
  Users,
  DollarSign,
  Wrench,
  Share2,
  ExternalLink,
  Trash2,
} from 'lucide-react'
import { useDesktopSelection } from '@/stores/desktop-selection-store'
import { cn } from '@/lib/cn'
import type { DbDesktopFolder, FolderIconPreset } from '@/types/database'
import type { LucideIcon } from 'lucide-react'

export const PRESET_ICONS: Record<FolderIconPreset, { icon: LucideIcon; defaultColor: string }> = {
  folder: { icon: Folder, defaultColor: '#3d8b9e' },
  whatsapp: { icon: MessageCircle, defaultColor: '#25D366' },
  documents: { icon: FileText, defaultColor: '#5a7fa0' },
  projects: { icon: Briefcase, defaultColor: '#8a7aaa' },
  media: { icon: Image, defaultColor: '#b08d6a' },
  contacts: { icon: Users, defaultColor: '#5b8a65' },
  finance: { icon: DollarSign, defaultColor: '#b85a50' },
  tools: { icon: Wrench, defaultColor: '#4a9090' },
  social: { icon: Share2, defaultColor: '#5ea3b4' },
  custom: { icon: Folder, defaultColor: '#9c8b78' },
}

interface Props {
  folder: DbDesktopFolder
  onOpen: (folderId: string) => void
  onDelete?: (folderId: string) => void
}

export function FolderIcon({ folder, onOpen, onDelete }: Props) {
  const selected = useDesktopSelection((s) => s.selected)
  const select = useDesktopSelection((s) => s.select)
  const toggleSelect = useDesktopSelection((s) => s.toggleSelect)
  const lastClickRef = useRef(0)
  const isSelected = selected.some((s) => s.type === 'folder' && s.id === folder.id)

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const preset = PRESET_ICONS[folder.icon_preset as FolderIconPreset] ?? PRESET_ICONS.folder
  const Icon = preset.icon
  const color = folder.color || preset.defaultColor

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      const now = Date.now()
      if (now - lastClickRef.current < 400) {
        onOpen(folder.id)
      } else if (e.shiftKey || e.metaKey) {
        toggleSelect('folder', folder.id)
      } else {
        select('folder', folder.id)
      }
      lastClickRef.current = now
    },
    [onOpen, select, folder.id],
  )

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onOpen(folder.id)
    },
    [onOpen, folder.id],
  )

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      select('folder', folder.id)
      setContextMenu({ x: e.clientX, y: e.clientY })
    },
    [select, folder.id],
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
        aria-label={`Open folder ${folder.name}`}
      >
        <div
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] transition-colors',
            isSelected ? 'ring-1 ring-[var(--color-accent)]' : '',
          )}
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <span
          className="text-[10px] text-center leading-tight line-clamp-2 w-full"
          style={{
            color: isSelected ? 'var(--color-accent)' : 'var(--color-desktop-text-secondary)',
            fontWeight: isSelected ? 500 : 400,
            textShadow: isSelected ? 'none' : 'var(--desktop-text-shadow)',
          }}
        >
          {folder.name}
        </span>
      </button>

      {contextMenu && (
        <FolderContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onOpen={() => {
            onOpen(folder.id)
            setContextMenu(null)
          }}
          onDelete={
            onDelete
              ? () => {
                  onDelete(folder.id)
                  setContextMenu(null)
                }
              : undefined
          }
        />
      )}
    </>
  )
}

function FolderContextMenu({
  x,
  y,
  onClose,
  onOpen,
  onDelete,
}: {
  x: number
  y: number
  onClose: () => void
  onOpen: () => void
  onDelete?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const deselect = useDesktopSelection((s) => s.deselect)

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

  const items: { label: string; icon: LucideIcon; action: () => void; danger?: boolean }[] = [
    {
      label: 'Open',
      icon: ExternalLink,
      action: () => {
        onOpen()
        deselect()
      },
    },
  ]

  if (onDelete) {
    items.push({
      label: 'Delete',
      icon: Trash2,
      action: () => {
        onDelete()
        deselect()
      },
      danger: true,
    })
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: Math.min(x, window.innerWidth - 200),
        top: Math.min(y, window.innerHeight - 200),
        zIndex: 9999,
      }}
    >
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
            style={{ color: item.danger ? 'var(--color-danger, #c4473a)' : 'var(--color-text-secondary)' }}
          >
            <item.icon size={13} className="shrink-0" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
