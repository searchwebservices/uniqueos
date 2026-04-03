import { useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
} from 'date-fns'
import type { DbCalendarEvent } from '@/types/database'
import { EventChip } from './EventChip'
import { cn } from '@/lib/cn'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface MonthViewProps {
  currentDate: Date
  events: DbCalendarEvent[]
  onDayClick: (date: Date) => void
  onEventClick: (event: DbCalendarEvent) => void
}

export function MonthView({
  currentDate,
  events,
  onDayClick,
  onEventClick,
}: MonthViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [currentDate])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, DbCalendarEvent[]>()
    for (const event of events) {
      const dayKey = format(new Date(event.start_at), 'yyyy-MM-dd')
      const existing = map.get(dayKey) ?? []
      existing.push(event)
      map.set(dayKey, existing)
    }
    return map
  }, [events])

  return (
    <div className="flex flex-col h-full">
      {/* Day name headers */}
      <div className="grid grid-cols-7 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            className="py-1.5 text-center text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {days.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd')
          const dayEvents = eventsByDay.get(dayKey) ?? []
          const inMonth = isSameMonth(day, currentDate)
          const today = isToday(day)

          return (
            <button
              key={dayKey}
              onClick={() => onDayClick(day)}
              className={cn(
                'relative flex flex-col items-start p-1 border-b border-r text-left min-h-0 overflow-hidden transition-colors hover:bg-[var(--color-bg-secondary)]',
                !inMonth && 'opacity-40',
              )}
              style={{
                borderColor: 'var(--color-border-subtle)',
              }}
            >
              <span
                className={cn(
                  'text-[11px] w-5 h-5 flex items-center justify-center rounded-full',
                  today
                    ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)] font-medium'
                    : 'text-[var(--color-text-secondary)]',
                )}
              >
                {format(day, 'd')}
              </span>
              <div className="w-full space-y-0.5 mt-0.5 overflow-hidden flex-1 min-h-0">
                {dayEvents.slice(0, 3).map((event) => (
                  <div key={event.id} onClick={(e) => e.stopPropagation()}>
                    <EventChip
                      event={event}
                      compact
                      onClick={onEventClick}
                    />
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-[var(--color-text-tertiary)] pl-1">
                    +{dayEvents.length - 3} more
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
