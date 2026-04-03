import { useCallback, useRef } from 'react'
import { Phone } from 'lucide-react'
import type { DbWhatsAppShortcut } from '@/types/database'

interface Props {
  shortcut: DbWhatsAppShortcut
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d]/g, '')
}

export function WhatsAppShortcutIcon({ shortcut }: Props) {
  const lastClickRef = useRef(0)

  const handleOpen = useCallback(() => {
    if (shortcut.type === 'direct' && shortcut.phone_number) {
      const cleaned = cleanPhoneNumber(shortcut.phone_number)
      window.open(`https://wa.me/${cleaned}`, '_blank')
    } else if (shortcut.type === 'group' && shortcut.group_invite_code) {
      window.open(`https://chat.whatsapp.com/${shortcut.group_invite_code}`, '_blank')
    }
  }, [shortcut])

  const handleClick = useCallback(() => {
    const now = Date.now()
    if (now - lastClickRef.current < 400) {
      handleOpen()
    }
    lastClickRef.current = now
  }, [handleOpen])

  return (
    <button
      onClick={handleClick}
      onDoubleClick={handleOpen}
      className="flex flex-col items-center gap-1 w-16 p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-desktop-icon-bg)] transition-colors select-none"
      aria-label={`Open WhatsApp chat with ${shortcut.name}`}
    >
      <div className="relative">
        {/* Initials avatar */}
        <div
          className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] text-white text-xs font-medium"
          style={{ background: shortcut.color || '#25D366' }}
        >
          {shortcut.icon_url ? (
            <img
              src={shortcut.icon_url}
              alt={shortcut.name}
              className="w-full h-full object-cover rounded-[var(--radius-md)]"
            />
          ) : (
            getInitials(shortcut.name)
          )}
        </div>

        {/* WhatsApp badge */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: '#25D366', border: '1.5px solid var(--color-bg-primary)' }}
        >
          <Phone size={8} color="white" />
        </div>
      </div>

      <span
        className="text-[10px] text-center leading-tight line-clamp-2"
        style={{
          color: 'var(--color-desktop-text-secondary)',
          textShadow: 'var(--desktop-text-shadow)',
        }}
      >
        {shortcut.name}
      </span>
    </button>
  )
}
