import { format, parseISO } from 'date-fns'
import type { DbCalendarEvent } from '@/types/database'

interface EventChipProps {
  event: DbCalendarEvent
  compact?: boolean
  onClick?: (event: DbCalendarEvent) => void
}

export function EventChip({ event, compact, onClick }: EventChipProps) {
  const color = event.color ?? 'var(--color-accent)'

  return (
    <button
      onClick={() => onClick?.(event)}
      className="w-full text-left rounded px-1.5 py-0.5 text-[11px] leading-tight truncate transition-opacity hover:opacity-80"
      style={{
        background: `${color}22`,
        borderLeft: `2px solid ${color}`,
        color: 'var(--color-text-primary)',
      }}
      title={event.title}
    >
      {!compact && !event.all_day && (
        <span className="opacity-60 mr-1">
          {format(parseISO(event.start_at), 'h:mm a')}
        </span>
      )}
      {event.title}
    </button>
  )
}
