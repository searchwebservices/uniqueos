import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ICON_LIBRARY, resolveIcon } from '@/lib/icon-library'
import { useDesktopCustomization, type DesktopItemOverride } from '@/stores/desktop-customization-store'

const COLOR_PRESETS = [
  '#b87a4b', '#4a7c59', '#4a6fa5', '#c4841d', '#c4473a',
  '#7c5cbf', '#3a8a8a', '#8a6d3b', '#667eea', '#25D366',
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
]

interface Props {
  itemKey: string
  defaultName: string
  defaultIconKey?: string
  defaultColor?: string
  onClose: () => void
}

export function AppEditDialog({ itemKey, defaultName, defaultIconKey, defaultColor, onClose }: Props) {
  const overrides = useDesktopCustomization((s) => s.overrides)
  const setOverride = useDesktopCustomization((s) => s.setOverride)
  const removeOverride = useDesktopCustomization((s) => s.removeOverride)
  const existing = overrides[itemKey]

  const [name, setName] = useState(existing?.name ?? defaultName)
  const [selectedIcon, setSelectedIcon] = useState(existing?.iconKey ?? defaultIconKey ?? '')
  const [selectedColor, setSelectedColor] = useState(existing?.color ?? defaultColor ?? '')

  const handleSave = () => {
    const override: DesktopItemOverride = {}
    if (name.trim() && name.trim() !== defaultName) override.name = name.trim()
    if (selectedIcon && selectedIcon !== defaultIconKey) override.iconKey = selectedIcon
    if (selectedColor && selectedColor !== defaultColor) override.color = selectedColor

    if (Object.keys(override).length > 0) {
      setOverride(itemKey, override)
    } else {
      removeOverride(itemKey)
    }
    onClose()
  }

  const handleReset = () => {
    removeOverride(itemKey)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') onClose()
  }

  const PreviewIcon = (selectedIcon ? resolveIcon(selectedIcon) : null) ?? resolveIcon(defaultIconKey ?? '')

  return (
    <>
      <div
        className="fixed inset-0"
        style={{ zIndex: 9998, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
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
            Edit Icon
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
          >
            <X size={14} className="text-[var(--color-text-tertiary)]" />
          </button>
        </div>

        <div className="px-4 py-4 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] outline-none transition-colors"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Icon
            </label>
            <div
              className="grid grid-cols-8 gap-1 max-h-[160px] overflow-y-auto p-1 rounded-[var(--radius-md)]"
              style={{ background: 'var(--color-bg-secondary)' }}
            >
              {ICON_LIBRARY.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedIcon(key)}
                  title={label}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors',
                    selectedIcon === key
                      ? 'bg-[var(--color-accent-subtle)] ring-1 ring-[var(--color-accent)]'
                      : 'hover:bg-[var(--color-bg-tertiary)]',
                  )}
                >
                  <Icon
                    size={16}
                    style={{ color: selectedIcon === key ? (selectedColor || 'var(--color-accent)') : 'var(--color-text-secondary)' }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'w-7 h-7 rounded-full transition-transform',
                    selectedColor === color ? 'scale-110' : 'hover:scale-105',
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
              style={{
                background: selectedColor ? `${selectedColor}20` : 'var(--color-bg-secondary)',
                border: selectedColor ? `1px solid ${selectedColor}40` : '1px solid var(--color-border-subtle)',
              }}
            >
              {PreviewIcon && (
                <PreviewIcon size={20} style={{ color: selectedColor || 'var(--color-text-primary)' }} />
              )}
            </div>
            <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
              {name.trim() || defaultName}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors bg-[var(--color-accent)] text-white hover:opacity-90"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
