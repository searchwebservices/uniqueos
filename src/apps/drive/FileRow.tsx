import { Folder, FileText, FileImage, FileVideo, FileAudio, File } from 'lucide-react'
import type { DbDriveItem } from '@/types/database'
import { cn } from '@/lib/cn'

interface FileRowProps {
  item: DbDriveItem
  selected: boolean
  onDoubleClick: () => void
  onClick: (e: React.MouseEvent) => void
  onContextMenu: (e: React.MouseEvent) => void
}

function getFileIcon(item: DbDriveItem) {
  if (item.type === 'folder') return Folder
  if (!item.mime_type) return File

  if (item.mime_type.startsWith('image/')) return FileImage
  if (item.mime_type.startsWith('video/')) return FileVideo
  if (item.mime_type.startsWith('audio/')) return FileAudio
  if (item.mime_type.includes('pdf') || item.mime_type.includes('text')) return FileText
  return File
}

function formatSize(bytes: number | null): string {
  if (bytes === null) return '--'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function formatMimeType(mimeType: string | null): string {
  if (!mimeType) return 'Folder'
  const parts = mimeType.split('/')
  return parts[1]?.toUpperCase() ?? mimeType
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

export function FileRow({
  item,
  selected,
  onDoubleClick,
  onClick,
  onContextMenu,
}: FileRowProps) {
  const Icon = getFileIcon(item)

  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_80px_100px_120px] gap-3 px-3 py-1.5 items-center cursor-default select-none transition-colors text-[11px]',
        selected
          ? 'bg-[var(--color-accent-subtle)]'
          : 'hover:bg-[var(--color-bg-tertiary)]',
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Icon
          size={14}
          className="shrink-0"
          style={{
            color: item.type === 'folder'
              ? 'var(--color-accent)'
              : 'var(--color-text-tertiary)',
          }}
        />
        <span
          className="truncate"
          style={{ color: 'var(--color-text-primary)' }}
          title={item.name}
        >
          {item.name}
        </span>
      </div>

      <span style={{ color: 'var(--color-text-tertiary)' }}>
        {formatSize(item.size_bytes)}
      </span>

      <span style={{ color: 'var(--color-text-tertiary)' }}>
        {formatMimeType(item.mime_type)}
      </span>

      <span style={{ color: 'var(--color-text-tertiary)' }}>
        {formatDate(item.updated_at)}
      </span>
    </div>
  )
}
