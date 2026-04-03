import { useState, useCallback } from 'react'
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  format,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import type { DbCalendarEvent } from '@/types/database'
import { useCalendarMonthEvents, useCalendarWeekEvents, useCalendarDayEvents } from './hooks'
import { MonthView } from './MonthView'
import { WeekView } from './WeekView'
import { DayView } from './DayView'
import { EventForm } from './EventForm'
import { MiniMonth } from './MiniMonth'
import { cn } from '@/lib/cn'

type CalendarView = 'month' | 'week' | 'day'

export function CalendarApp() {
  const [view, setView] = useState<CalendarView>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<DbCalendarEvent | null>(null)
  const [clickedDate, setClickedDate] = useState<Date | null>(null)

  // Use the appropriate hook based on view
  const monthData = useCalendarMonthEvents(currentDate)
  const weekData = useCalendarWeekEvents(currentDate)
  const dayData = useCalendarDayEvents(currentDate)

  const activeData =
    view === 'month' ? monthData : view === 'week' ? weekData : dayData

  const navigate = useCallback(
    (direction: -1 | 1) => {
      setCurrentDate((prev) => {
        if (view === 'month')
          return direction === 1 ? addMonths(prev, 1) : subMonths(prev, 1)
        if (view === 'week')
          return direction === 1 ? addWeeks(prev, 1) : subWeeks(prev, 1)
        return direction === 1 ? addDays(prev, 1) : subDays(prev, 1)
      })
    },
    [view],
  )

  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  function openCreate(date?: Date) {
    setEditingEvent(null)
    setClickedDate(date ?? null)
    setShowForm(true)
  }

  function openEdit(event: DbCalendarEvent) {
    setEditingEvent(event)
    setClickedDate(null)
    setShowForm(true)
  }

  function handleSave(
    data: Omit<
      DbCalendarEvent,
      'id' | 'user_id' | 'created_at' | 'updated_at'
    >,
  ) {
    if (editingEvent) {
      activeData.updateEvent.mutate({ id: editingEvent.id, ...data })
    } else {
      activeData.createEvent.mutate(data)
    }
    setShowForm(false)
    setEditingEvent(null)
  }

  function handleDelete() {
    if (editingEvent) {
      activeData.deleteEvent.mutate(editingEvent.id)
    }
    setShowForm(false)
    setEditingEvent(null)
  }

  const headerLabel =
    view === 'month'
      ? format(currentDate, 'MMMM yyyy')
      : view === 'week'
        ? `Week of ${format(currentDate, 'MMM d, yyyy')}`
        : format(currentDate, 'MMMM d, yyyy')

  return (
    <div className="@container flex flex-col h-full bg-[var(--color-bg-elevated)]">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b shrink-0"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <ChevronLeft size={14} className="text-[var(--color-text-secondary)]" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <ChevronRight size={14} className="text-[var(--color-text-secondary)]" />
          </button>
          <h2 className="text-sm font-medium text-[var(--color-text-primary)] ml-2">
            {headerLabel}
          </h2>
          <button
            onClick={goToToday}
            className="ml-2 px-2.5 py-1 text-[11px] rounded-[var(--radius-md)] border text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            style={{ borderColor: 'var(--color-border)' }}
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div
            className="flex rounded-[var(--radius-md)] border overflow-hidden"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {(['month', 'week', 'day'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-2.5 py-1 text-[11px] capitalize transition-colors',
                  view === v
                    ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]',
                )}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Create button */}
          <button
            onClick={() => openCreate()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)] transition-colors hover:opacity-90"
            style={{ background: 'var(--color-accent)' }}
          >
            <Plus size={12} />
            Event
          </button>
        </div>
      </div>

      {/* Calendar body — sidebar + view */}
      <div className="flex flex-1 min-h-0">
        {/* Mini month sidebar — visible at wider container sizes */}
        <div
          className="hidden @[640px]:flex flex-col gap-4 p-3 border-r shrink-0"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <MiniMonth
            currentDate={currentDate}
            selectedDate={currentDate}
            onSelectDate={(date) => {
              setCurrentDate(date)
              setView('day')
            }}
            onChangeMonth={setCurrentDate}
          />

          {/* Upcoming events */}
          <div>
            <h3 className="text-[10px] font-medium uppercase text-[var(--color-text-tertiary)] mb-1.5 px-1">
              Upcoming
            </h3>
            <div className="space-y-1">
              {activeData.events
                .filter((e) => new Date(e.start_at) >= new Date())
                .slice(0, 4)
                .map((event) => (
                  <button
                    key={event.id}
                    onClick={() => openEdit(event)}
                    className="w-full text-left px-2 py-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                  >
                    <div className="text-[10px] text-[var(--color-text-tertiary)]">
                      {format(new Date(event.start_at), event.all_day ? 'MMM d' : 'MMM d, h:mm a')}
                    </div>
                    <div className="text-[11px] font-medium text-[var(--color-text-primary)] truncate">
                      {event.title}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Main calendar view */}
        <div className="flex-1 min-h-0 min-w-0">
          {activeData.isLoading ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-sm text-[var(--color-text-tertiary)]">
                Loading...
              </span>
            </div>
          ) : view === 'month' ? (
            <MonthView
              currentDate={currentDate}
              events={activeData.events}
              onDayClick={(date) => {
                setCurrentDate(date)
                setView('day')
              }}
              onEventClick={openEdit}
            />
          ) : view === 'week' ? (
            <WeekView
              currentDate={currentDate}
              events={activeData.events}
              onTimeClick={(date) => openCreate(date)}
              onEventClick={openEdit}
            />
          ) : (
            <DayView
              currentDate={currentDate}
              events={activeData.events}
              onTimeClick={(date) => openCreate(date)}
              onEventClick={openEdit}
            />
          )}
        </div>
      </div>

      {/* Event form modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          defaultDate={clickedDate ?? currentDate}
          onSave={handleSave}
          onDelete={editingEvent ? handleDelete : undefined}
          onClose={() => {
            setShowForm(false)
            setEditingEvent(null)
          }}
        />
      )}
    </div>
  )
}
