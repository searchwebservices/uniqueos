import { useState, useEffect } from 'react'
import { Search, Bell, Loader2 } from 'lucide-react'
import { useCommandPaletteStore } from '@/stores/command-palette-store'
import { useNotificationStore } from '@/stores/notification-store'
import { useSyncStatus } from '@/providers/SyncProvider'
import { ProfileDropdown } from './ProfileDropdown'
import { NotificationCenter } from './NotificationCenter'
import { cn } from '@/lib/cn'

function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000 * 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="text-xs text-[var(--color-text-secondary)]">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  )
}

function ConnectionStatus() {
  const { isOnline, isSyncing, pendingCount } = useSyncStatus()

  if (isSyncing) {
    return (
      <div className="flex items-center gap-1" title="Syncing...">
        <Loader2 size={10} className="animate-spin text-[var(--color-accent)]" />
        <span className="text-[10px] text-[var(--color-text-tertiary)]">
          Syncing
        </span>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-1"
      title={isOnline ? (pendingCount > 0 ? `${pendingCount} pending` : 'Online') : 'Offline'}
    >
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: isOnline ? 'var(--color-success)' : 'var(--color-error)',
        }}
      />
      {!isOnline && (
        <span className="text-[10px] text-[var(--color-error)]">Offline</span>
      )}
    </div>
  )
}

export function TopBar() {
  const openPalette = useCommandPaletteStore(s => s.open)
  const unreadCount = useNotificationStore(s => s.unreadCount())
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header
      className="fixed top-0 inset-x-0 h-9 flex items-center px-3 gap-3 backdrop-blur-md border-b select-none"
      style={{
        zIndex: 1000,
        background: 'var(--color-topbar-bg)',
        borderColor: 'var(--color-topbar-border)',
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded bg-[var(--color-accent)] flex items-center justify-center">
          <span className="text-[10px] font-bold text-[var(--color-text-inverse)]">U</span>
        </div>
        <span className="text-xs font-medium text-[var(--color-text-primary)] hidden sm:inline">
          UniqueOS
        </span>
      </div>

      {/* Center: Search trigger */}
      <button
        onClick={openPalette}
        className={cn(
          'flex items-center gap-1.5 mx-auto px-3 py-1 rounded-[var(--radius-full)]',
          'text-xs text-[var(--color-text-tertiary)]',
          'bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)]',
          'border border-[var(--color-border-subtle)]',
          'transition-colors'
        )}
      >
        <Search size={12} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline text-[10px] opacity-60 ml-2">
          {navigator.platform?.includes('Mac') ? '\u2318' : 'Ctrl+'}K
        </kbd>
      </button>

      {/* Right: Connection, clock, bell, profile */}
      <div className="flex items-center gap-2">
        <ConnectionStatus />
        <Clock />

        {/* Notification bell */}
        <button
          onClick={() => setShowNotifications(prev => !prev)}
          className="relative w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={14} className="text-[var(--color-text-secondary)]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--color-accent)] text-[8px] font-medium text-[var(--color-text-inverse)] flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(p => !p)}
            className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[10px] font-medium text-[var(--color-text-inverse)] hover:opacity-90 transition-opacity"
            aria-label="Profile menu"
          >
            L
          </button>
          {showProfile && <ProfileDropdown onClose={() => setShowProfile(false)} />}
        </div>
      </div>

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter onClose={() => setShowNotifications(false)} />
      )}
    </header>
  )
}
