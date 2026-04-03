import { useState, useRef, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface FileUploaderProps {
  onUpload: (files: File[]) => void
  uploading: boolean
}

export function FileUploader({ onUpload, uploading }: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (uploading) return

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        onUpload(files)
      }
    },
    [onUpload, uploading],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) {
        onUpload(files)
      }
      // Reset input so same file can be re-selected
      e.target.value = ''
    },
    [onUpload],
  )

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-6 rounded-[var(--radius-md)] border-2 border-dashed transition-colors cursor-pointer',
        dragOver
          ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
          : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {uploading ? (
        <>
          <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          <p
            className="text-xs"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Uploading...
          </p>
        </>
      ) : (
        <>
          <Upload size={20} style={{ color: 'var(--color-text-tertiary)' }} />
          <p
            className="text-xs text-center"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Drop files here or click to upload
          </p>
        </>
      )}
    </div>
  )
}

interface UploadProgressProps {
  fileName: string
  progress: number
  onCancel?: () => void
}

export function UploadProgress({ fileName, progress, onCancel }: UploadProgressProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border"
      style={{
        borderColor: 'var(--color-border-subtle)',
        background: 'var(--color-bg-secondary)',
      }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="text-[11px] truncate"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {fileName}
        </p>
        <div
          className="w-full h-1 rounded-full mt-1 overflow-hidden"
          style={{ background: 'var(--color-bg-tertiary)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(100, progress)}%`,
              background: 'var(--color-accent)',
            }}
          />
        </div>
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          className="shrink-0 p-0.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}
