import { useState } from 'react'
import { X } from 'lucide-react'
import { useImageGallery } from './hooks'

export function ImageGallery() {
  const { images, isLoading } = useImageGallery()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <span
          className="text-xs"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Loading gallery...
        </span>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="p-4 text-center">
        <span
          className="text-xs"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          No generated images yet
        </span>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2 p-4">
        {images.map((img) => (
          <button
            key={img.name}
            onClick={() => setPreviewUrl(img.url)}
            className="aspect-square rounded-[var(--radius-md)] overflow-hidden transition-opacity hover:opacity-80"
            style={{
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <img
              src={img.url}
              alt={img.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Preview overlay */}
      {previewUrl && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 1000, background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-[80vw] max-h-[80vh]">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-3 -right-3 p-1 rounded-full"
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
              }}
            >
              <X size={14} style={{ color: 'var(--color-text-primary)' }} />
            </button>
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-[80vh] rounded-[var(--radius-lg)]"
            />
          </div>
        </div>
      )}
    </>
  )
}
