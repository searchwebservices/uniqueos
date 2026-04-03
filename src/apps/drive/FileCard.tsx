import { useState, useEffect } from 'react'
import { Folder, FileText, FileImage, FileVideo, FileAudio, File } from 'lucide-react'
import type { DbDriveItem } from '@/types/database'
import { getSignedUrl } from './hooks'
import { cn } from '@/lib/cn'

interface FileCardProps {
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
  if (bytes === null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export function FileCard({
  item,
  selected,
  onDoubleClick,
  onClick,
  onContextMenu,
}: FileCardProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const Icon = getFileIcon(item)
  const isImage = item.mime_type?.startsWith('image/')

  useEffect(() => {
    if (isImage && item.storage_path) {
      getSignedUrl(item.storage_path).then(setThumbnailUrl).catch(() => {
        // Ignore thumbnail errors
      })
    }
  }, [isImage, item.storage_path])

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-[var(--radius-md)] border cursor-default select-none transition-colors',
        selected
          ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
          : 'border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-tertiary)]',
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {/* Thumbnail / Icon */}
      <div className="w-full aspect-square flex items-center justify-center rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-bg-tertiary)]">
        {isImage && thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon
            size={32}
            style={{
              color: item.type === 'folder'
                ? 'var(--color-accent)'
                : 'var(--color-text-tertiary)',
            }}
          />
        )}
      </div>

      {/* Name + size */}
      <div className="w-full text-center min-w-0">
        <p
          className="text-[11px] font-medium truncate"
          style={{ color: 'var(--color-text-primary)' }}
          title={item.name}
        >
          {item.name}
        </p>
        {item.size_bytes !== null && (
          <p
            className="text-[10px] mt-0.5"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {formatSize(item.size_bytes)}
          </p>
        )}
      </div>
    </div>
  )
}
