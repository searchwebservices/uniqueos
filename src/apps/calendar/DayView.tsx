import { useMemo } from 'react'
import {
  format,
  isToday,
  parseISO,
  differenceInMinutes,
  startOfDay,
} from 'date-fns'
import type { DbCalendarEvent } from '@/types/database'

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const HOUR_HEIGHT = 56 // px per hour

interface DayViewProps {
  currentDate: Date
  events: DbCalendarEvent[]
  onTimeClick: (date: Date) => void
  onEventClick: (event: DbCalendarEvent) => void
}

export function DayView({
  currentDate,
  events,
  onTimeClick,
  onEventClick,
}: DayViewProps) {
  const allDayEvents = useMemo(
    () => events.filter((e) => e.all_day),
    [events],
  )
  const timedEvents = useMemo(
    () => events.filter((e) => !e.all_day),
    [events],
  )

  return (
    <div className="flex flex-col h-full">
      {/* Day header */}
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <div className="text-[10px] uppercase text-[var(--color-text-tertiary)]">
          {format(currentDate, 'EEEE')}
        </div>
        <div
          className={
            isToday(currentDate)
              ? 'text-xl font-medium text-[var(--color-accent)]'
              : 'text-xl font-medium text-[var(--color-text-primary)]'
          }
        >
          {format(currentDate, 'MMMM d, yyyy')}
        </div>
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div
          className="px-4 py-2 border-b space-y-1"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <span className="text-[10px] uppercase text-[var(--color-text-tertiary)]">
            All day
          </span>
          {allDayEvents.map((event) => {
            const color = event.color ?? 'var(--color-accent)'
            return (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className="block w-full text-left rounded px-2 py-1 text-xs transition-opacity hover:opacity-80"
                style={{
                  background: `${color}22`,
                  borderLeft: `2px solid ${color}`,
                }}
              >
                {event.title}
              </button>
            )
          })}
        </div>
      )}

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="relative"
          style={{ height: HOURS.length * HOUR_HEIGHT }}
        >
          {/* Hour rows */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="absolute w-full flex border-t"
              style={{
                top: hour * HOUR_HEIGHT,
                borderColor: 'var(--color-border-subtle)',
              }}
              onClick={() => {
                const date = new Date(currentDate)
                date.setHours(hour, 0, 0, 0)
                onTimeClick(date)
              }}
            >
              <div className="w-16 shrink-0 text-right pr-3 -mt-1.5 text-[10px] text-[var(--color-text-tertiary)]">
                {hour === 0
                  ? ''
                  : format(new Date(2000, 0, 1, hour), 'h a')}
              </div>
              <div className="flex-1 cursor-pointer hover:bg-[var(--color-bg-secondary)] transition-colors" />
            </div>
          ))}

          {/* Timed events */}
          {timedEvents.map((event) => {
            const start = parseISO(event.start_at)
            const end = parseISO(event.end_at)
            const dayStart = startOfDay(currentDate)
            const topMinutes = differenceInMinutes(start, dayStart)
            const durationMinutes = Math.max(
              differenceInMinutes(end, start),
              30,
            )
            const top = (topMinutes / 60) * HOUR_HEIGHT
            const height = (durationMinutes / 60) * HOUR_HEIGHT
            const color = event.color ?? 'var(--color-accent)'

            return (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className="absolute rounded px-2 py-1 text-left text-xs overflow-hidden transition-opacity hover:opacity-80"
                style={{
                  top,
                  height,
                  left: 64,
                  right: 8,
                  background: `${color}33`,
                  borderLeft: `3px solid ${color}`,
                  color: 'var(--color-text-primary)',
                }}
              >
                <div className="font-medium truncate">{event.title}</div>
                <div className="opacity-60">
                  {format(start, 'h:mm a')} - {format(end, 'h:mm a')}
                </div>
                {event.description && (
                  <div className="mt-0.5 opacity-50 text-[11px] truncate">
                    {event.description}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
