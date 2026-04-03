import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  format,
} from 'date-fns'
import { useWindowStore } from '@/stores/window-store'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'
import type { WidgetProps } from '@/types/os'

export function CalendarWidget(_props: WidgetProps) {
  const [viewDate, setViewDate] = useState(new Date())
  const openWindow = useWindowStore((s) => s.openWindow)
  const today = useMemo(() => new Date(), [])

  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)

  // Fetch events for current month
  const { events } = useCalendarEvents({
    rangeStart: monthStart.toISOString(),
    rangeEnd: monthEnd.toISOString(),
  })

  // Build set of dates that have events
  const eventDays = useMemo(() => {
    return events.map((e) => new Date(e.start_at))
  }, [events])

  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  function handleDayClick(day: Date) {
    openWindow('calendar', { date: day.toISOString() })
  }

  return (
    <div className="flex flex-col gap-1.5 h-full">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setViewDate((d) => subMonths(d, 1))}
          className="w-5 h-5 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <ChevronLeft size={12} />
        </button>
        <span
          className="text-xs font-medium"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {format(viewDate, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setViewDate((d) => addMonths(d, 1))}
          className="w-5 h-5 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0">
        {weekDays.map((wd) => (
          <div
            key={wd}
            className="text-center text-[10px] py-0.5"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0 flex-1">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, viewDate)
          const isToday = isSameDay(day, today)
          const hasEvent = eventDays.some((ed) => isSameDay(ed, day))

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className="relative flex flex-col items-center justify-center py-0.5 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
              style={{
                color: isToday
                  ? 'var(--color-bg-elevated)'
                  : isCurrentMonth
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-tertiary)',
                background: isToday ? 'var(--color-accent)' : undefined,
              }}
            >
              <span className="text-[11px] leading-none">{format(day, 'd')}</span>
              {hasEvent && !isToday && (
                <div
                  className="absolute bottom-0.5 w-1 h-1 rounded-full"
                  style={{ background: 'var(--color-accent)' }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
