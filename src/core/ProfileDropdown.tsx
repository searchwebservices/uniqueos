import { useEffect, useRef } from 'react'
import { Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useWindowStore } from '@/stores/window-store'

interface Props {
  onClose: () => void
}

export function ProfileDropdown({ onClose }: Props) {
  const { user, profile, signOut } = useAuth()
  const openWindow = useWindowStore(s => s.openWindow)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', keyHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [onClose])

  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'User'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 w-56 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-lg)] overflow-hidden"
      style={{ zIndex: 1100 }}
    >
      {/* User info */}
      <div className="px-3 py-3 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2.5">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-xs font-medium text-[var(--color-text-inverse)]">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-[var(--color-text-tertiary)] truncate">
              {user.email}
            </p>
          </div>
        </div>
        {profile?.role && (
          <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded-[var(--radius-full)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
            {profile.role}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="py-1">
        <button
          onClick={() => {
            openWindow('settings')
            onClose()
          }}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
        >
          <Settings size={14} className="text-[var(--color-text-secondary)]" />
          Settings
        </button>
        <button
          onClick={async () => {
            await signOut()
            onClose()
          }}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[var(--color-error)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
        >
          <LogOut size={14} />
          Log out
        </button>
      </div>
    </div>
  )
}
