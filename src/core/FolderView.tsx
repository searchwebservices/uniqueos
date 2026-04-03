import { useEffect, useRef } from 'react'
import {
  X,
  Folder,
  FileText,
  Link2,
  User,
  AppWindow,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useFolderItems } from '@/hooks/useFolders'
import { PRESET_ICONS } from './FolderIcon'
import type { DbDesktopFolder, FolderIconPreset, FolderItemType } from '@/types/database'
import type { LucideIcon } from 'lucide-react'

const ITEM_TYPE_ICONS: Record<FolderItemType, { icon: LucideIcon; color: string }> = {
  app: { icon: AppWindow, color: '#8a7aaa' },
  shortcut: { icon: Link2, color: '#5a7fa0' },
  subfolder: { icon: Folder, color: '#3d8b9e' },
  file: { icon: FileText, color: '#5b8a65' },
  link: { icon: Link2, color: '#5ea3b4' },
  contact: { icon: User, color: '#4a9090' },
}

interface Props {
  folder: DbDesktopFolder
  onClose: () => void
  onOpenSubfolder?: (folderId: string) => void
}

export function FolderView({ folder, onClose, onOpenSubfolder }: Props) {
  const { items, isLoading } = useFolderItems(folder.id)
  const overlayRef = useRef<HTMLDivElement>(null)

  const preset = PRESET_ICONS[folder.icon_preset as FolderIconPreset] ?? PRESET_ICONS.folder
  const FolderHeaderIcon = preset.icon
  const color = folder.color || preset.defaultColor

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9000, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="w-[480px] max-h-[420px] flex flex-col rounded-[var(--radius-lg)] animate-in fade-in zoom-in-95 duration-200"
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)]"
            style={{ background: `${color}20`, border: `1px solid ${color}40` }}
          >
            <FolderHeaderIcon size={16} style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className="text-sm font-medium truncate"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {folder.name}
            </h2>
            <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
              {isLoading ? 'Loading...' : `${items.length} item${items.length !== 1 ? 's' : ''}`}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
          >
            <X size={14} className="text-[var(--color-text-tertiary)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Loading items...
              </span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-3">
              <Folder size={32} className="text-[var(--color-text-tertiary)]" style={{ opacity: 0.4 }} />
              <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                This folder is empty
              </span>
              <button
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-[var(--radius-md)] transition-colors',
                  'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] hover:opacity-80',
                )}
              >
                <Plus size={12} />
                Add items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-1">
              {items.map((item) => {
                const typeInfo = ITEM_TYPE_ICONS[item.item_type as FolderItemType] ?? ITEM_TYPE_ICONS.file
                const ItemIcon = typeInfo.icon
                const itemColor = typeInfo.color

                const handleItemClick = () => {
                  if (item.item_type === 'subfolder' && onOpenSubfolder) {
                    onOpenSubfolder(item.item_id)
                  }
                }

                return (
                  <button
                    key={item.id}
                    onClick={handleItemClick}
                    className="flex flex-col items-center gap-1 p-2 rounded-[var(--radius-md)] transition-colors hover:bg-[var(--color-bg-tertiary)]/50 select-none"
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)]"
                      style={{ background: `${itemColor}15`, border: `1px solid ${itemColor}30` }}
                    >
                      <ItemIcon size={18} style={{ color: itemColor }} />
                    </div>
                    <span
                      className="text-[10px] text-center leading-tight line-clamp-2 w-full"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {item.label || item.item_id}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
