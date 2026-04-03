import { FileText } from 'lucide-react'
import { useTranscription } from './hooks'
import type { DbVoiceMemo } from '@/types/database'

interface Props {
  memo: DbVoiceMemo
}

export function TranscriptionView({ memo }: Props) {
  const transcribe = useTranscription(memo.id)

  if (memo.transcript_status === 'done' && memo.transcript) {
    return (
      <div className="p-3 rounded-[var(--radius-md)]" style={{ background: 'var(--color-bg-secondary)' }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
          {memo.transcript}
        </p>
      </div>
    )
  }

  if (memo.transcript_status === 'processing') {
    return (
      <div className="p-3 text-center">
        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          Transcribing...
        </span>
      </div>
    )
  }

  if (memo.transcript_status === 'failed') {
    return (
      <div className="p-3 text-center">
        <span className="text-xs" style={{ color: '#ef4444' }}>
          Transcription failed
        </span>
        <button
          onClick={() => transcribe.mutate()}
          disabled={transcribe.isPending}
          className="ml-2 text-xs underline"
          style={{ color: 'var(--color-accent)' }}
        >
          Retry
        </button>
      </div>
    )
  }

  // pending
  return (
    <button
      onClick={() => transcribe.mutate()}
      disabled={transcribe.isPending}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors"
      style={{
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-primary)',
      }}
    >
      <FileText size={12} />
      Transcribe
    </button>
  )
}
