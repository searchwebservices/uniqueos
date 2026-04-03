import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ExternalLink,
  X,
  Clock,
  MapPin,
} from 'lucide-react'
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

// ── Mock events for demo ──
interface MockEvent {
  id: string
  title: string
  time: string
  duration: string
  color: string
  location?: string
}

const MOCK_EVENTS: Record<string, MockEvent[]> = (() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  const key = (day: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return {
    [key(3)]: [
      { id: 'm1', title: 'Llamada con Sarah Mitchell', time: '10:00 AM', duration: '30 min', color: '#4a6fa5', location: 'Zoom' },
      { id: 'm2', title: 'Revisión de florales', time: '2:00 PM', duration: '1 hr', color: '#4a7c59' },
    ],
    [key(7)]: [
      { id: 'm3', title: 'Visita al venue - Resort Palmilla', time: '9:00 AM', duration: '2 hr', color: '#c4841d', location: 'Palmilla Resort' },
    ],
    [key(10)]: [
      { id: 'm4', title: 'Degustación de menú', time: '12:00 PM', duration: '1.5 hr', color: '#7c5cbf', location: 'Cocina del Chef' },
      { id: 'm5', title: 'Llamada con Thompson', time: '4:00 PM', duration: '45 min', color: '#4a6fa5' },
    ],
    [key(12)]: [
      { id: 'm6', title: 'Entrega de cotización - Williams', time: '11:00 AM', duration: '30 min', color: '#c4473a' },
    ],
    [key(15)]: [
      { id: 'm7', title: 'Reunión de equipo UCW', time: '9:30 AM', duration: '1 hr', color: '#3a8a8a', location: 'Oficina' },
      { id: 'm8', title: 'Prueba de iluminación', time: '5:00 PM', duration: '2 hr', color: '#c4841d', location: 'Venue principal' },
    ],
    [key(18)]: [
      { id: 'm9', title: 'Sesión de fotos - lookbook', time: '10:00 AM', duration: '3 hr', color: '#667eea', location: 'Playa' },
    ],
    [key(20)]: [
      { id: 'm10', title: 'Boda Thompson-Garcia', time: '4:00 PM', duration: '6 hr', color: '#c4473a', location: 'Cabo del Sol' },
    ],
    [key(22)]: [
      { id: 'm11', title: 'Inventario de bodega', time: '10:00 AM', duration: '2 hr', color: '#8a6d3b', location: 'Bodega UCW' },
      { id: 'm12', title: 'Llamada con proveedor de telas', time: '3:00 PM', duration: '30 min', color: '#4a6fa5' },
    ],
    [key(25)]: [
      { id: 'm13', title: 'Consulta inicial - Pareja nueva', time: '11:00 AM', duration: '1 hr', color: '#7c5cbf', location: 'Zoom' },
    ],
    [key(28)]: [
      { id: 'm14', title: 'Revisión final - Boda Mitchell', time: '2:00 PM', duration: '1.5 hr', color: '#4a7c59' },
      { id: 'm15', title: 'Cierre de mes - facturación', time: '5:00 PM', duration: '1 hr', color: '#c4841d' },
    ],
  }
})()

function getMockEventsForDay(day: Date): MockEvent[] {
  const key = format(day, 'yyyy-MM-dd')
  return MOCK_EVENTS[key] ?? []
}

const DRAWER_WIDTH = 260
const DRAWER_GAP = 8

export function CalendarWidget(_props: WidgetProps) {
  const [viewDate, setViewDate] = useState(new Date())
  const openWindow = useWindowStore((s) => s.openWindow)
  const today = useMemo(() => new Date(), [])

  // Drawer state
  const [drawerDay, setDrawerDay] = useState<Date | null>(null)
  const widgetRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)

  const { events } = useCalendarEvents({
    rangeStart: monthStart.toISOString(),
    rangeEnd: monthEnd.toISOString(),
  })

  const eventDays = useMemo(() => {
    const realDays = events.map((e) => new Date(e.start_at))
    const mockDays: Date[] = []
    for (const [dateStr] of Object.entries(MOCK_EVENTS)) {
      const d = new Date(dateStr + 'T12:00:00')
      if (isSameMonth(d, viewDate)) mockDays.push(d)
    }
    return [...realDays, ...mockDays]
  }, [events, viewDate])

  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

  const handleDayClick = useCallback(
    (day: Date, e: React.MouseEvent) => {
      e.stopPropagation()
      if (drawerDay && isSameDay(day, drawerDay)) {
        setDrawerDay(null)
        return
      }
      setDrawerDay(day)
    },
    [drawerDay],
  )

  // Compute drawer position: always to the left of the widget frame
  const [drawerPos, setDrawerPos] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (!drawerDay || !widgetRef.current) {
      setDrawerPos(null)
      return
    }
    // Walk up to find the widget-frame container
    const frameEl = widgetRef.current.closest('[data-widget-frame]') as HTMLElement | null
    const anchorEl = frameEl ?? widgetRef.current
    const rect = anchorEl.getBoundingClientRect()

    // Position to the left of the widget
    const left = rect.left - DRAWER_WIDTH - DRAWER_GAP
    // Clamp top so it doesn't go off-screen
    const top = Math.max(8, Math.min(rect.top, window.innerHeight - 360))

    setDrawerPos({ top, left: Math.max(8, left) })
  }, [drawerDay])

  // Close on click outside
  useEffect(() => {
    if (!drawerDay) return
    const handle = (e: MouseEvent) => {
      const target = e.target as Node
      if (widgetRef.current?.contains(target) || drawerRef.current?.contains(target)) return
      setDrawerDay(null)
    }
    window.addEventListener('mousedown', handle)
    return () => window.removeEventListener('mousedown', handle)
  }, [drawerDay])

  // Close on Escape
  useEffect(() => {
    if (!drawerDay) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerDay(null)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [drawerDay])

  const drawerEvents = drawerDay ? getMockEventsForDay(drawerDay) : []

  return (
    <div ref={widgetRef} className="flex flex-col gap-1.5 h-full">
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
          const isSelected = drawerDay ? isSameDay(day, drawerDay) : false

          return (
            <button
              key={day.toISOString()}
              onClick={(e) => handleDayClick(day, e)}
              className="relative flex flex-col items-center justify-center py-0.5 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
              style={{
                color: isToday
                  ? 'var(--color-bg-elevated)'
                  : isCurrentMonth
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-tertiary)',
                background: isToday
                  ? 'var(--color-accent)'
                  : isSelected
                    ? 'var(--color-accent-subtle)'
                    : undefined,
                outline: isSelected && !isToday ? '1px solid var(--color-accent)' : undefined,
              }}
            >
              <span className="text-[11px] leading-none">{format(day, 'd')}</span>
              {hasEvent && (
                <div
                  className="absolute bottom-0.5 w-1 h-1 rounded-full"
                  style={{
                    background: isToday ? 'var(--color-bg-elevated)' : 'var(--color-accent)',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Day drawer — portal to body so it escapes widget overflow:hidden */}
      {drawerDay &&
        drawerPos &&
        createPortal(
          <div
            ref={drawerRef}
            style={{
              position: 'fixed',
              top: drawerPos.top,
              left: drawerPos.left,
              width: DRAWER_WIDTH,
              maxHeight: 360,
              zIndex: 9000,
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeIn 150ms ease-out',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-3 py-2.5 shrink-0"
              style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
            >
              <div>
                <div
                  className="text-xs font-semibold"
                  style={{
                    color: isSameDay(drawerDay, today)
                      ? 'var(--color-accent)'
                      : 'var(--color-text-primary)',
                  }}
                >
                  {format(drawerDay, 'EEEE')}
                </div>
                <div
                  className="text-[10px]"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {format(drawerDay, 'd MMMM yyyy')}
                </div>
              </div>
              <button
                onClick={() => setDrawerDay(null)}
                className="w-5 h-5 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <X size={12} className="text-[var(--color-text-tertiary)]" />
              </button>
            </div>

            {/* Events list */}
            <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2 space-y-1.5">
              {drawerEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-1">
                  <span
                    className="text-[11px]"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    Sin eventos
                  </span>
                </div>
              ) : (
                drawerEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex gap-2 px-2 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                  >
                    <div
                      className="w-0.5 shrink-0 rounded-full mt-0.5"
                      style={{ background: evt.color, minHeight: 32 }}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[11px] font-medium leading-tight"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {evt.title}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock
                          size={9}
                          className="text-[var(--color-text-tertiary)] shrink-0"
                        />
                        <span
                          className="text-[9px]"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        >
                          {evt.time} · {evt.duration}
                        </span>
                      </div>
                      {evt.location && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin
                            size={9}
                            className="text-[var(--color-text-tertiary)] shrink-0"
                          />
                          <span
                            className="text-[9px] truncate"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          >
                            {evt.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer actions */}
            <div
              className="flex items-center gap-1.5 px-2 py-2 shrink-0"
              style={{ borderTop: '1px solid var(--color-border-subtle)' }}
            >
              <button
                onClick={() => {
                  openWindow('calendar', {
                    date: drawerDay.toISOString(),
                    action: 'new',
                  })
                  setDrawerDay(null)
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-[var(--radius-md)] text-[10px] font-medium transition-colors hover:bg-[var(--color-bg-tertiary)]"
                style={{ color: 'var(--color-accent)' }}
              >
                <Plus size={11} />
                Nuevo evento
              </button>
              <button
                onClick={() => {
                  openWindow('calendar', { date: drawerDay.toISOString() })
                  setDrawerDay(null)
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-[var(--radius-md)] text-[10px] font-medium transition-colors hover:bg-[var(--color-bg-tertiary)]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <ExternalLink size={10} />
                Abrir calendario
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
