import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useFolders } from '@/hooks/useFolders'
import { PRESET_ICONS } from './FolderIcon'
import type { FolderIconPreset } from '@/types/database'

const ACCENT_PRESETS = [
  '#3d8b9e',
  '#5b8a65',
  '#5a7fa0',
  '#b08d6a',
  '#b85a50',
  '#8a7aaa',
  '#4a9090',
  '#8a6d3b',
  '#667eea',
  '#25D366',
]

const PRESET_LABELS: Record<FolderIconPreset, string> = {
  folder: 'Folder',
  whatsapp: 'WhatsApp',
  documents: 'Documents',
  projects: 'Projects',
  media: 'Media',
  contacts: 'Contacts',
  finance: 'Finance',
  tools: 'Tools',
  social: 'Social',
  custom: 'Custom',
}

interface Props {
  onClose: () => void
}

export function FolderCreateDialog({ onClose }: Props) {
  const { createFolder } = useFolders()
  const [name, setName] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<FolderIconPreset>('folder')
  const [selectedColor, setSelectedColor] = useState('#3d8b9e')

  const handleCreate = () => {
    const trimmed = name.trim()
    if (!trimmed) return

    createFolder.mutate(
      {
        name: trimmed,
        icon_preset: selectedPreset,
        color: selectedColor,
      },
      { onSuccess: () => onClose() },
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleCreate()
    }
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const presetEntries = Object.entries(PRESET_ICONS) as [FolderIconPreset, (typeof PRESET_ICONS)[FolderIconPreset]][]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 9998, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] rounded-[var(--radius-lg)] animate-in fade-in zoom-in-95 duration-200"
        style={{
          zIndex: 9999,
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xl)',
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <h2 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            New Folder
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
          >
            <X size={14} className="text-[var(--color-text-tertiary)]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-5">
          {/* Name input */}
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Untitled Folder"
              autoFocus
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] outline-none transition-colors"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* Icon preset picker */}
          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presetEntries.map(([key, { icon: PresetIcon, defaultColor }]) => {
                const isActive = selectedPreset === key
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedPreset(key)
                      setSelectedColor(defaultColor)
                    }}
                    className={cn(
                      'flex flex-col items-center gap-1 py-2 px-1 rounded-[var(--radius-md)] transition-colors',
                      isActive
                        ? 'bg-[var(--color-accent-subtle)] ring-1 ring-[var(--color-accent)]'
                        : 'hover:bg-[var(--color-bg-tertiary)]',
                    )}
                  >
                    <PresetIcon
                      size={18}
                      style={{ color: isActive ? selectedColor : defaultColor }}
                    />
                    <span
                      className="text-[9px] leading-tight"
                      style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }}
                    >
                      {PRESET_LABELS[key]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'w-7 h-7 rounded-full transition-transform',
                    selectedColor === color ? 'scale-110 ring-2 ring-offset-2' : 'hover:scale-105',
                  )}
                  style={{
                    background: color,
                    outline: selectedColor === color ? `2px solid ${color}` : '2px solid transparent',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 pt-1">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)]"
              style={{ background: `${selectedColor}20`, border: `1px solid ${selectedColor}40` }}
            >
              {(() => {
                const PreviewIcon = PRESET_ICONS[selectedPreset].icon
                return <PreviewIcon size={20} style={{ color: selectedColor }} />
              })()}
            </div>
            <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
              {name.trim() || 'Untitled Folder'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-4 py-3 border-t"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || createFolder.isPending}
            className={cn(
              'px-4 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors',
              name.trim()
                ? 'bg-[var(--color-accent)] text-white hover:opacity-90'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] cursor-not-allowed',
            )}
          >
            {createFolder.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </>
  )
}
