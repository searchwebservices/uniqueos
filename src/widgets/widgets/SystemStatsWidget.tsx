import { useState, useEffect } from 'react'
import { Monitor, Wifi, WifiOff } from 'lucide-react'
import type { WidgetProps } from '@/types/os'

export function SystemStatsWidget(_props: WidgetProps) {
  const [now, setNow] = useState(new Date())
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const browser = (() => {
    const ua = navigator.userAgent
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Edg')) return 'Edge'
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Safari')) return 'Safari'
    return 'Unknown'
  })()

  const resolution = `${window.screen.width} x ${window.screen.height}`
  const dateStr = now.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const timeStr = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  const stats = [
    { label: 'Date', value: dateStr },
    { label: 'Time', value: timeStr },
    { label: 'Browser', value: browser },
    { label: 'Screen', value: resolution },
  ]

  return (
    <div className="flex flex-col gap-1.5 h-full">
      <div className="flex flex-col gap-1 flex-1">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between px-1"
          >
            <span
              className="text-[10px]"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {stat.label}
            </span>
            <span
              className="text-[11px] font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-1 py-1 rounded-[var(--radius-sm)]"
        style={{ background: 'var(--color-bg-tertiary)' }}
      >
        <div className="flex items-center gap-1.5">
          <Monitor size={11} className="text-[var(--color-text-tertiary)]" />
          <span
            className="text-[10px]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            TabletopOS
          </span>
        </div>
        <div className="flex items-center gap-1">
          {online ? (
            <Wifi size={11} style={{ color: 'var(--color-success)' }} />
          ) : (
            <WifiOff size={11} style={{ color: 'var(--color-error)' }} />
          )}
          <span
            className="text-[10px]"
            style={{ color: online ? 'var(--color-success)' : 'var(--color-error)' }}
          >
            {online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  )
}
