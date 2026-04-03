import { useState, useEffect } from 'react'
import type { WidgetProps } from '@/types/os'

export function ClockWidget(_props: WidgetProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const timeStr = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
  const seconds = now.toLocaleTimeString([], { second: '2-digit' }).slice(-2)
  const dateStr = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col items-center justify-center h-full gap-1">
      <div className="flex items-baseline gap-1">
        <span
          className="text-3xl font-medium tabular-nums"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {timeStr}
        </span>
        <span
          className="text-sm tabular-nums"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {seconds}
        </span>
      </div>
      <span
        className="text-xs"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {dateStr}
      </span>
    </div>
  )
}
