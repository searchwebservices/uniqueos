import { useState, useMemo } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { getAllApps, getApp } from '@/lib/app-registry'
import { usePageShortcuts } from '@/stores/page-shortcuts-store'
import { toast } from 'sonner'

interface Props {
  onClose: () => void
}

const ACCENT_PRESETS = [
  '#4a6fa5', '#4a7c59', '#c4841d', '#c4473a', '#7c5cbf',
  '#3a8a8a', '#667eea', '#8a6d3b',
]

/**
 * Define which apps support deep-link parameters.
 * Each entry lists the fields the user can fill in to build meta.
 */
const APP_PARAMS: Record<string, { label: string; key: string; placeholder: string }[]> = {
  couples: [
    { label: 'ID de pareja', key: 'coupleId', placeholder: 'ej. thompson-garcia' },
  ],
  'wedding-timeline': [
    { label: 'ID de pareja', key: 'coupleId', placeholder: 'ej. thompson-garcia' },
  ],
  quotes: [
    { label: 'ID de cotización', key: 'quoteId', placeholder: 'ej. Q-2024-001' },
  ],
  notes: [
    { label: 'ID de nota', key: 'noteId', placeholder: 'ej. uuid' },
  ],
  contacts: [
    { label: 'ID de contacto', key: 'contactId', placeholder: 'ej. uuid' },
  ],
  calendar: [
    { label: 'Fecha (ISO)', key: 'date', placeholder: 'ej. 2026-04-15T00:00:00' },
  ],
}

export function PageShortcutForm({ onClose }: Props) {
  const addShortcut = usePageShortcuts((s) => s.addShortcut)
  const apps = getAllApps()

  const [name, setName] = useState('')
  const [selectedAppId, setSelectedAppId] = useState('')
  const [color, setColor] = useState('#4a6fa5')
  const [paramValues, setParamValues] = useState<Record<string, string>>({})

  const selectedApp = useMemo(
    () => (selectedAppId ? getApp(selectedAppId) : null),
    [selectedAppId],
  )
  const appParams = selectedAppId ? APP_PARAMS[selectedAppId] ?? [] : []

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Ingresa un nombre')
      return
    }
    if (!selectedAppId) {
      toast.error('Selecciona una app')
      return
    }

    const meta: Record<string, unknown> = {}
    for (const param of appParams) {
      if (paramValues[param.key]?.trim()) {
        meta[param.key] = paramValues[param.key].trim()
      }
    }

    addShortcut({
      name: name.trim(),
      appId: selectedAppId,
      meta,
      color,
    })

    toast.success('Atajo creado')
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim() && selectedAppId) handleCreate()
    if (e.key === 'Escape') onClose()
  }

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
          <h2
            className="text-sm font-medium flex items-center gap-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <ExternalLink size={14} className="text-[var(--color-text-tertiary)]" />
            Nuevo atajo de página
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
          >
            <X size={14} className="text-[var(--color-text-tertiary)]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4">
          {/* Name */}
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Nombre del atajo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej. Timeline Thompson-Garcia"
              autoFocus
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] outline-none transition-colors"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* App selector */}
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              App destino
            </label>
            <select
              value={selectedAppId}
              onChange={(e) => {
                setSelectedAppId(e.target.value)
                setParamValues({})
              }}
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] outline-none transition-colors"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              <option value="">Seleccionar app...</option>
              {apps.map((app) => (
                <option key={app.appId} value={app.appId}>
                  {app.title}
                </option>
              ))}
            </select>
          </div>

          {/* Deep-link params */}
          {appParams.length > 0 && (
            <div className="space-y-3">
              <label
                className="block text-xs font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Parámetros
              </label>
              {appParams.map((param) => (
                <div key={param.key}>
                  <label
                    className="block text-[11px] mb-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {param.label}
                  </label>
                  <input
                    type="text"
                    value={paramValues[param.key] ?? ''}
                    onChange={(e) =>
                      setParamValues((prev) => ({ ...prev, [param.key]: e.target.value }))
                    }
                    placeholder={param.placeholder}
                    className="w-full px-3 py-1.5 text-xs rounded-[var(--radius-md)] outline-none"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Color picker */}
          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform"
                  style={{
                    background: c,
                    transform: color === c ? 'scale(1.1)' : undefined,
                    outline: color === c ? `2px solid ${c}` : '2px solid transparent',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {selectedApp && (
            <div className="flex items-center gap-3 pt-1">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)]"
                style={{ background: `${color}20`, border: `1px solid ${color}40` }}
              >
                <selectedApp.icon size={20} style={{ color }} />
              </div>
              <div>
                <span className="text-sm block" style={{ color: 'var(--color-text-primary)' }}>
                  {name.trim() || 'Sin nombre'}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {selectedApp.title}
                  {Object.values(paramValues).some((v) => v.trim()) && ' · con parámetros'}
                </span>
              </div>
            </div>
          )}
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
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || !selectedAppId}
            className="px-4 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: name.trim() && selectedAppId ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
              color: name.trim() && selectedAppId ? 'white' : 'var(--color-text-tertiary)',
            }}
          >
            Crear atajo
          </button>
        </div>
      </div>
    </>
  )
}
