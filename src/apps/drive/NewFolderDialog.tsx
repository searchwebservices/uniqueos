import { useState } from 'react'
import { X } from 'lucide-react'

interface NewFolderDialogProps {
  onConfirm: (name: string) => void
  onClose: () => void
}

export function NewFolderDialog({ onConfirm, onClose }: NewFolderDialogProps) {
  const [name, setName] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) {
      onConfirm(trimmed)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-[320px] rounded-[var(--radius-lg)] overflow-hidden shadow-lg"
        style={{ background: 'var(--color-bg-elevated)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <h3
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            New folder
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
            autoFocus
            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border outline-none transition-colors"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-accent)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-border)'
            }}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] border hover:bg-[var(--color-bg-tertiary)] transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)] transition-colors disabled:opacity-50"
              style={{ background: 'var(--color-accent)' }}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
