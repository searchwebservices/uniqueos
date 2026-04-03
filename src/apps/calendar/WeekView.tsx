import { useMemo } from 'react'
import {
  startOfWeek,
  addDays,
  format,
  isToday,
  parseISO,
  differenceInMinutes,
  startOfDay,
} from 'date-fns'
import type { DbCalendarEvent } from '@/types/database'
import { cn } from '@/lib/cn'

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const HOUR_HEIGHT = 48 // px per hour

interface WeekViewProps {
  currentDate: Date
  events: DbCalendarEvent[]
  onTimeClick: (date: Date) => void
  onEventClick: (event: DbCalendarEvent) => void
}

export function WeekView({
  currentDate,
  events,
  onTimeClick,
  onEventClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  )

  const eventsByDay = useMemo(() => {
    const map = new Map<string, DbCalendarEvent[]>()
    for (const event of events) {
      const dayKey = format(parseISO(event.start_at), 'yyyy-MM-dd')
      const existing = map.get(dayKey) ?? []
      existing.push(event)
      map.set(dayKey, existing)
    }
    return map
  }, [events])

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      <div
        className="grid border-b sticky top-0 z-10"
        style={{
          gridTemplateColumns: '48px repeat(7, 1fr)',
          borderColor: 'var(--color-border-subtle)',
          background: 'var(--color-bg-elevated)',
        }}
      >
        <div />
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              'py-2 text-center border-l',
              isToday(day) && 'bg-[var(--color-accent-subtle)]',
            )}
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            <div className="text-[10px] uppercase text-[var(--color-text-tertiary)]">
              {format(day, 'EEE')}
            </div>
            <div
              className={cn(
                'text-sm',
                isToday(day)
                  ? 'font-medium text-[var(--color-accent)]'
                  : 'text-[var(--color-text-primary)]',
              )}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: '48px repeat(7, 1fr)',
            height: HOURS.length * HOUR_HEIGHT,
          }}
        >
          {/* Hour labels */}
          <div className="relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute w-full text-right pr-2 text-[10px] text-[var(--color-text-tertiary)]"
                style={{ top: hour * HOUR_HEIGHT - 6 }}
              >
                {hour === 0 ? '' : format(new Date(2000, 0, 1, hour), 'h a')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd')
            const dayEvents = eventsByDay.get(dayKey) ?? []

            return (
              <div
                key={dayKey}
                className="relative border-l"
                style={{ borderColor: 'var(--color-border-subtle)' }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const y = e.clientY - rect.top
                  const hour = Math.floor(y / HOUR_HEIGHT)
                  const date = new Date(day)
                  date.setHours(hour, 0, 0, 0)
                  onTimeClick(date)
                }}
              >
                {/* Hour lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute w-full border-t"
                    style={{
                      top: hour * HOUR_HEIGHT,
                      borderColor: 'var(--color-border-subtle)',
                    }}
                  />
                ))}

                {/* Events */}
                {dayEvents
                  .filter((e) => !e.all_day)
                  .map((event) => {
                    const start = parseISO(event.start_at)
                    const end = parseISO(event.end_at)
                    const dayStart = startOfDay(day)
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
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(event)
                        }}
                        className="absolute left-0.5 right-0.5 rounded px-1.5 py-0.5 text-[10px] leading-tight overflow-hidden text-left transition-opacity hover:opacity-80"
                        style={{
                          top,
                          height,
                          background: `${color}33`,
                          borderLeft: `2px solid ${color}`,
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        <div className="font-medium truncate">
                          {event.title}
                        </div>
                        <div className="opacity-60 truncate">
                          {format(start, 'h:mm a')}
                        </div>
                      </button>
                    )
                  })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
