import { useState } from 'react'
import { X, Copy, Check, Globe, GlobeLock } from 'lucide-react'
import type { DbDriveItem } from '@/types/database'

interface PublishDialogProps {
  item: DbDriveItem
  onPublish: () => void
  onUnpublish: () => void
  onClose: () => void
  publishing: boolean
}

export function PublishDialog({
  item,
  onPublish,
  onUnpublish,
  onClose,
  publishing,
}: PublishDialogProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!item.public_url) return
    await navigator.clipboard.writeText(item.public_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-[380px] rounded-[var(--radius-lg)] overflow-hidden shadow-lg"
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
            {item.is_published ? 'Published' : 'Publish file'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {item.is_published && item.public_url ? (
            <>
              <div className="flex items-center gap-2">
                <Globe
                  size={14}
                  style={{ color: 'var(--color-success)' }}
                />
                <span
                  className="text-xs"
                  style={{ color: 'var(--color-success)' }}
                >
                  This file is publicly accessible
                </span>
              </div>

              <div
                className="flex items-center gap-2 p-2 rounded-[var(--radius-md)] border"
                style={{
                  borderColor: 'var(--color-border-subtle)',
                  background: 'var(--color-bg-secondary)',
                }}
              >
                <input
                  type="text"
                  readOnly
                  value={item.public_url}
                  className="flex-1 text-[11px] bg-transparent outline-none truncate"
                  style={{ color: 'var(--color-text-secondary)' }}
                />
                <button
                  onClick={handleCopy}
                  className="shrink-0 p-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  title={copied ? 'Copied' : 'Copy URL'}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>

              <button
                onClick={onUnpublish}
                disabled={publishing}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs rounded-[var(--radius-md)] border transition-colors hover:bg-[var(--color-bg-tertiary)] disabled:opacity-50"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-error)',
                }}
              >
                <GlobeLock size={12} />
                Unpublish
              </button>
            </>
          ) : (
            <>
              <p
                className="text-xs"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Publishing will create a public URL anyone can use to access
                this file.
              </p>

              <div className="flex justify-end gap-2">
                <button
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
                  onClick={onPublish}
                  disabled={publishing}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)] transition-colors disabled:opacity-50"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <Globe size={12} />
                  {publishing ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
