import { Pin } from 'lucide-react'
import type { DbNote } from '@/types/database'
import { cn } from '@/lib/cn'

interface NoteListItemProps {
  note: DbNote
  active: boolean
  onClick: () => void
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  // Within last day
  if (diff < 86400000) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }
  // Within last week
  if (diff < 604800000) {
    return d.toLocaleDateString([], { weekday: 'short' })
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function getPreview(plainText: string | null): string {
  if (!plainText) return 'Empty note'
  // Skip first line (title) and take next content
  const lines = plainText.split('\n').filter(Boolean)
  if (lines.length <= 1) return 'No additional text'
  return lines.slice(1).join(' ').slice(0, 80)
}

export function NoteListItem({ note, active, onClick }: NoteListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-3 py-2.5 border-b transition-colors',
        active
          ? 'bg-[var(--color-accent-subtle)]'
          : 'hover:bg-[var(--color-bg-tertiary)]',
      )}
      style={{ borderColor: 'var(--color-border-subtle)' }}
    >
      <div className="flex items-center gap-1.5">
        {note.pinned && (
          <Pin
            size={10}
            className="shrink-0"
            style={{ color: 'var(--color-accent)' }}
          />
        )}
        <span
          className="text-[12px] font-medium truncate"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {note.title}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <span
          className="text-[10px] shrink-0"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {formatDate(note.updated_at)}
        </span>
        <span
          className="text-[10px] truncate"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {getPreview(note.plain_text)}
        </span>
      </div>
    </button>
  )
}
