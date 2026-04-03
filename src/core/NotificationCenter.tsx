import { useEffect, useRef } from 'react'
import { X, Trash2, Bell, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { useNotificationStore } from '@/stores/notification-store'
import { cn } from '@/lib/cn'
import type { NotificationType } from '@/types/os'

interface Props {
  onClose: () => void
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'success':
      return CheckCircle2
    case 'warning':
      return AlertTriangle
    case 'error':
      return AlertCircle
    case 'info':
    default:
      return Info
  }
}

function getNotificationColor(type: NotificationType): string {
  switch (type) {
    case 'success':
      return 'var(--color-success)'
    case 'warning':
      return 'var(--color-warning)'
    case 'error':
      return 'var(--color-error)'
    case 'info':
    default:
      return 'var(--color-info)'
  }
}

function formatTimestamp(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return new Date(ts).toLocaleDateString()
}

export function NotificationCenter({ onClose }: Props) {
  const notifications = useNotificationStore(s => s.notifications)
  const dismiss = useNotificationStore(s => s.dismiss)
  const markRead = useNotificationStore(s => s.markRead)
  const clearAll = useNotificationStore(s => s.clearAll)
  const panelRef = useRef<HTMLDivElement>(null)

  // Mark all as read on open
  useEffect(() => {
    for (const n of notifications) {
      if (!n.read) markRead(n.id)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // Delay to avoid the bell click closing it immediately
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handler)
    }, 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handler)
    }
  }, [onClose])

  return (
    <div
      ref={panelRef}
      className={cn(
        'fixed top-[var(--topbar-height)] right-0 w-80 max-h-[calc(100vh-var(--topbar-height)-var(--dock-height))]',
        'flex flex-col border-l border-b rounded-bl-[var(--radius-lg)]',
        'overflow-hidden',
        'animate-in slide-in-from-right duration-200',
      )}
      style={{
        zIndex: 1500,
        background: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--color-border-subtle)]">
        <h2 className="text-sm font-medium text-[var(--color-text-primary)]">Notifications</h2>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <button
              onClick={() => clearAll()}
              className="flex items-center gap-1 px-2 py-1 rounded-[var(--radius-sm)] text-[10px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <Trash2 size={10} />
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <X size={12} className="text-[var(--color-text-tertiary)]" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Bell size={24} className="text-[var(--color-text-tertiary)]" />
            <p className="text-xs text-[var(--color-text-tertiary)]">No notifications</p>
          </div>
        ) : (
          notifications.map(n => {
            const Icon = getNotificationIcon(n.type)
            const color = getNotificationColor(n.type)
            return (
              <div
                key={n.id}
                className="flex items-start gap-2.5 px-3 py-2.5 border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <Icon
                  size={14}
                  className="shrink-0 mt-0.5"
                  style={{ color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                    {n.title}
                  </p>
                  {n.message && (
                    <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                  )}
                  <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">
                    {formatTimestamp(n.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => dismiss(n.id)}
                  className="shrink-0 w-5 h-5 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  <X size={10} className="text-[var(--color-text-tertiary)]" />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
