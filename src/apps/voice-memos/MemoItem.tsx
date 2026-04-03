import { useState } from 'react'
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useVoiceMemos } from './hooks'
import { AudioPlayer } from './AudioPlayer'
import { TranscriptionView } from './TranscriptionView'
import { formatDuration } from './utils'
import type { DbVoiceMemo } from '@/types/database'

interface Props {
  memo: DbVoiceMemo
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--color-text-tertiary)',
  processing: 'var(--color-accent)',
  done: '#22c55e',
  failed: '#ef4444',
}

export function MemoItem({ memo }: Props) {
  const { updateMemo, deleteMemo } = useVoiceMemos()
  const [expanded, setExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(memo.title)

  const { data: signedData } = supabase.storage
    .from('voice-memos')
    .getPublicUrl(memo.storage_path)

  const audioUrl = signedData?.publicUrl ?? ''

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle.trim() !== memo.title) {
      updateMemo.mutate({ id: memo.id, title: editTitle.trim() })
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteMemo.mutate(memo)
  }

  const dateStr = new Date(memo.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: 'var(--color-border-subtle)' }}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-[var(--color-bg-tertiary)] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown size={14} style={{ color: 'var(--color-text-tertiary)' }} />
        ) : (
          <ChevronRight size={14} style={{ color: 'var(--color-text-tertiary)' }} />
        )}

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle()
                if (e.key === 'Escape') {
                  setEditTitle(memo.title)
                  setIsEditing(false)
                }
              }}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              className="text-xs font-medium w-full px-1 py-0.5 rounded outline-none"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          ) : (
            <span
              className="text-xs font-medium block truncate"
              style={{ color: 'var(--color-text-primary)' }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
            >
              {memo.title}
            </span>
          )}

          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
              {dateStr}
            </span>
            {memo.duration_seconds != null && (
              <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                {formatDuration(memo.duration_seconds)}
              </span>
            )}
          </div>
        </div>

        {/* Transcript status badge */}
        <span
          className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
          style={{
            color: STATUS_COLORS[memo.transcript_status] ?? 'var(--color-text-tertiary)',
            border: `1px solid ${STATUS_COLORS[memo.transcript_status] ?? 'var(--color-border)'}`,
          }}
        >
          {memo.transcript_status}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete()
          }}
          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[var(--color-bg-secondary)] transition-all shrink-0"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-3 pt-1 space-y-3">
          <AudioPlayer url={audioUrl} totalDuration={memo.duration_seconds} />
          <TranscriptionView memo={memo} />
        </div>
      )}
    </div>
  )
}
