import { Mic } from 'lucide-react'
import { useVoiceMemos } from './hooks'
import { RecordingControls } from './RecordingControls'
import { MemoItem } from './MemoItem'

export function VoiceMemosApp() {
  const { memos, isLoading } = useVoiceMemos()

  return (
    <div className="@container flex flex-col h-full bg-[var(--color-bg-elevated)]">
      {/* Recording controls */}
      <div
        className="shrink-0 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <RecordingControls />
      </div>

      {/* Memo list */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Loading memos...
            </span>
          </div>
        ) : memos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <Mic size={20} style={{ color: 'var(--color-text-tertiary)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              No voice memos yet
            </span>
          </div>
        ) : (
          <div>
            {memos.map((memo) => (
              <MemoItem key={memo.id} memo={memo} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
