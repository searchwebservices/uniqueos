import { Mic, Square } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useRecorder, useVoiceMemos } from './hooks'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { formatDuration } from './utils'

export function RecordingControls() {
  const { user } = useAuth()
  const { isRecording, duration, blob, start, stop, reset } = useRecorder()
  const { createMemo } = useVoiceMemos()

  const handleToggle = async () => {
    if (isRecording) {
      stop()
    } else {
      await start()
    }
  }

  const handleSave = async () => {
    if (!blob) return

    const fileName = `${user.id}/${Date.now()}.webm`

    const { error: uploadError } = await supabase.storage
      .from('voice-memos')
      .upload(fileName, blob, {
        contentType: blob.type || 'audio/webm',
      })

    if (uploadError) {
      toast.error('Upload failed: ' + uploadError.message)
      return
    }

    const title = `Recording ${new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })}`

    await createMemo.mutateAsync({
      title,
      storage_path: fileName,
      duration_seconds: duration,
    })

    reset()
    toast.success('Voice memo saved')
  }

  const handleDiscard = () => {
    reset()
  }

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {/* Recording timer */}
      {(isRecording || blob) && (
        <span
          className="text-sm font-mono tabular-nums"
          style={{ color: isRecording ? '#ef4444' : 'var(--color-text-primary)' }}
        >
          {formatDuration(duration)}
        </span>
      )}

      {/* Main record button */}
      <button
        onClick={handleToggle}
        disabled={!!blob}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
        style={{
          background: isRecording ? '#ef4444' : 'var(--color-accent)',
          boxShadow: isRecording
            ? '0 0 0 4px rgba(239,68,68,0.3)'
            : undefined,
        }}
      >
        {isRecording ? (
          <Square size={20} fill="white" color="white" />
        ) : (
          <Mic size={22} color="white" />
        )}
      </button>

      <span
        className="text-[10px]"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        {isRecording ? 'Tap to stop' : blob ? 'Recording complete' : 'Tap to record'}
      </span>

      {/* Save / Discard after recording */}
      {blob && (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={createMemo.isPending}
            className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-accent-foreground)',
            }}
          >
            {createMemo.isPending ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleDiscard}
            className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            Discard
          </button>
        </div>
      )}
    </div>
  )
}
