import { useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
  addMonths,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

interface MiniMonthProps {
  currentDate: Date
  selectedDate: Date
  onSelectDate: (date: Date) => void
  onChangeMonth: (date: Date) => void
}

export function MiniMonth({
  currentDate,
  selectedDate,
  onSelectDate,
  onChangeMonth,
}: MiniMonthProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [currentDate])

  return (
    <div className="w-[200px] select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-medium text-[var(--color-text-primary)]">
          {format(currentDate, 'MMM yyyy')}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onChangeMonth(subMonths(currentDate, 1))}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <ChevronLeft size={12} className="text-[var(--color-text-tertiary)]" />
          </button>
          <button
            onClick={() => onChangeMonth(addMonths(currentDate, 1))}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <ChevronRight size={12} className="text-[var(--color-text-tertiary)]" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-0.5">
        {DAY_NAMES.map((name, i) => (
          <div
            key={i}
            className="text-center text-[9px] font-medium text-[var(--color-text-tertiary)] py-0.5"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentDate)
          const today = isToday(day)
          const selected = isSameDay(day, selectedDate)

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                'w-full aspect-square flex items-center justify-center text-[10px] rounded-full transition-colors',
                !inMonth && 'opacity-30',
                today && !selected && 'text-[var(--color-accent)] font-medium',
                selected && 'bg-[var(--color-accent)] text-[var(--color-text-inverse)] font-medium',
                !selected && inMonth && 'hover:bg-[var(--color-bg-tertiary)]',
              )}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
