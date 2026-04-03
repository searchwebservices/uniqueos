import { useState } from 'react'
import { X, Phone } from 'lucide-react'
import { useWhatsAppShortcuts } from '@/hooks/useWhatsAppShortcuts'
import { toast } from 'sonner'

interface Props {
  onClose: () => void
}

const DEFAULT_COLORS = [
  '#25D366', '#128C7E', '#075E54', '#34B7F1',
  '#6366f1', '#ec4899', '#f59e0b', '#10b981',
]

function extractGroupCode(input: string): string {
  // Extract code from chat.whatsapp.com/CODE or just return as-is
  const match = input.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/)
  return match ? match[1] : input.trim()
}

function cleanPhoneForPreview(phone: string): string {
  return phone.replace(/[^\d+]/g, '')
}

export function WhatsAppShortcutForm({ onClose }: Props) {
  const { createShortcut } = useWhatsAppShortcuts()
  const [name, setName] = useState('')
  const [type, setType] = useState<'direct' | 'group'>('direct')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [groupLink, setGroupLink] = useState('')
  const [color, setColor] = useState('#25D366')

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Enter a name')
      return
    }

    if (type === 'direct' && !phoneNumber.trim()) {
      toast.error('Enter a phone number')
      return
    }

    if (type === 'group' && !groupLink.trim()) {
      toast.error('Enter a group invite link')
      return
    }

    await createShortcut.mutateAsync({
      name: name.trim(),
      type,
      phone_number: type === 'direct' ? cleanPhoneForPreview(phoneNumber) : null,
      group_invite_code: type === 'group' ? extractGroupCode(groupLink) : null,
      icon_url: null,
      color,
      position: null,
      folder_id: null,
    })

    toast.success('Shortcut created')
    onClose()
  }

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 999, background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 rounded-[var(--radius-lg)] p-4"
        style={{
          zIndex: 1000,
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            New WhatsApp shortcut
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--color-bg-tertiary)]">
            <X size={14} style={{ color: 'var(--color-text-tertiary)' }} />
          </button>
        </div>

        <div className="space-y-3">
          {/* Preview */}
          <div className="flex items-center justify-center py-2">
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center text-white text-sm font-medium"
                  style={{ background: color }}
                >
                  {initials || '?'}
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: '#25D366', border: '1.5px solid var(--color-bg-elevated)' }}
                >
                  <Phone size={8} color="white" />
                </div>
              </div>
              <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
                {name || 'Preview'}
              </span>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contact or group name"
              className="w-full px-3 py-1.5 text-xs rounded-[var(--radius-md)] outline-none"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* Type toggle */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Type
            </label>
            <div className="flex gap-1">
              {(['direct', 'group'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-[var(--radius-md)] transition-colors"
                  style={{
                    background: type === t ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                    color: type === t ? 'var(--color-accent-foreground)' : 'var(--color-text-secondary)',
                    border: `1px solid ${type === t ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  }}
                >
                  {t === 'direct' ? 'Direct chat' : 'Group chat'}
                </button>
              ))}
            </div>
          </div>

          {/* Phone number or group link */}
          {type === 'direct' ? (
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Phone number (with country code)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+52 624 123 4567"
                className="w-full px-3 py-1.5 text-xs rounded-[var(--radius-md)] outline-none"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Group invite link
              </label>
              <input
                type="text"
                value={groupLink}
                onChange={(e) => setGroupLink(e.target.value)}
                placeholder="https://chat.whatsapp.com/ABC123..."
                className="w-full px-3 py-1.5 text-xs rounded-[var(--radius-md)] outline-none"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
          )}

          {/* Color picker */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Avatar color
            </label>
            <div className="flex gap-1.5">
              {DEFAULT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-full transition-transform"
                  style={{
                    background: c,
                    transform: color === c ? 'scale(1.2)' : undefined,
                    border: color === c ? '2px solid var(--color-text-primary)' : '2px solid transparent',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={createShortcut.isPending}
            className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors disabled:opacity-50"
            style={{
              background: '#25D366',
              color: 'white',
            }}
          >
            {createShortcut.isPending ? 'Creating...' : 'Create shortcut'}
          </button>
        </div>
      </div>
    </>
  )
}
