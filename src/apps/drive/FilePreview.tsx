import { useState, useEffect } from 'react'
import { X, Download, ExternalLink } from 'lucide-react'
import type { DbDriveItem } from '@/types/database'
import { getSignedUrl } from './hooks'

interface FilePreviewProps {
  item: DbDriveItem
  onClose: () => void
}

export function FilePreview({ item, onClose }: FilePreviewProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!item.storage_path) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    getSignedUrl(item.storage_path)
      .then(setUrl)
      .catch(() => setError('Failed to load file'))
      .finally(() => setLoading(false))
  }, [item.storage_path])

  const isImage = item.mime_type?.startsWith('image/')
  const isPdf = item.mime_type === 'application/pdf'
  const isText =
    item.mime_type?.startsWith('text/') ||
    item.mime_type === 'application/json'

  function handleDownload() {
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-[90%] max-w-[800px] h-[80%] max-h-[600px] rounded-[var(--radius-lg)] overflow-hidden"
        style={{ background: 'var(--color-bg-elevated)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2 shrink-0 border-b"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <h3
            className="text-sm font-medium truncate"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {item.name}
          </h3>
          <div className="flex items-center gap-1">
            {item.public_url && (
              <a
                href={item.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
                title="Open public URL"
              >
                <ExternalLink size={14} />
              </a>
            )}
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
              title="Download"
            >
              <Download size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 flex items-center justify-center p-4 overflow-auto">
          {loading ? (
            <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          ) : error ? (
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {error}
            </p>
          ) : isImage && url ? (
            <img
              src={url}
              alt={item.name}
              className="max-w-full max-h-full object-contain rounded-[var(--radius-sm)]"
            />
          ) : isPdf && url ? (
            <iframe
              src={url}
              className="w-full h-full rounded-[var(--radius-sm)]"
              title={item.name}
            />
          ) : isText && url ? (
            <TextPreview url={url} />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                Preview not available for this file type
              </p>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)]"
                style={{ background: 'var(--color-accent)' }}
              >
                <Download size={12} />
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TextPreview({ url }: { url: string }) {
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    fetch(url)
      .then((r) => r.text())
      .then(setText)
      .catch(() => setText('Failed to load text'))
  }, [url])

  if (text === null) {
    return (
      <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
    )
  }

  return (
    <pre
      className="w-full h-full overflow-auto text-xs p-4 rounded-[var(--radius-sm)] font-mono whitespace-pre-wrap"
      style={{
        color: 'var(--color-text-primary)',
        background: 'var(--color-bg-secondary)',
      }}
    >
      {text}
    </pre>
  )
}
