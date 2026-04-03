import { useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'

export function useCalendarMonthEvents(date: Date) {
  const rangeStart = format(startOfMonth(date), "yyyy-MM-dd'T'HH:mm:ss")
  const rangeEnd = format(endOfMonth(date), "yyyy-MM-dd'T'23:59:59")

  return useCalendarEvents({ rangeStart, rangeEnd })
}

export function useCalendarWeekEvents(date: Date) {
  const rangeStart = format(
    startOfWeek(date, { weekStartsOn: 0 }),
    "yyyy-MM-dd'T'HH:mm:ss",
  )
  const rangeEnd = format(
    endOfWeek(date, { weekStartsOn: 0 }),
    "yyyy-MM-dd'T'23:59:59",
  )

  return useCalendarEvents({ rangeStart, rangeEnd })
}

export function useCalendarDayEvents(date: Date) {
  const rangeStart = format(startOfDay(date), "yyyy-MM-dd'T'HH:mm:ss")
  const rangeEnd = format(endOfDay(date), "yyyy-MM-dd'T'23:59:59")

  return useCalendarEvents({ rangeStart, rangeEnd })
}

export function useEventsForDate(
  events: { start_at: string; end_at: string }[],
  date: Date,
) {
  return useMemo(() => {
    const dayStart = startOfDay(date).toISOString()
    const dayEnd = endOfDay(date).toISOString()

    return events.filter(
      (e) => e.start_at <= dayEnd && e.end_at >= dayStart,
    )
  }, [events, date])
}
