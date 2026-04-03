import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { DbCalendarEvent } from '@/types/database'

const EVENT_COLORS = [
  '#3d8b9e',
  '#5b8a65',
  '#5a7fa0',
  '#b08d6a',
  '#b85a50',
  '#8a7aaa',
  '#4a9090',
  '#9c8b78',
]

const RECURRENCE_OPTIONS = [
  { value: '', label: 'No repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

interface EventFormProps {
  event?: DbCalendarEvent | null
  defaultDate?: Date
  onSave: (
    data: Omit<
      DbCalendarEvent,
      'id' | 'user_id' | 'created_at' | 'updated_at'
    >,
  ) => void
  onDelete?: () => void
  onClose: () => void
}

export function EventForm({
  event,
  defaultDate,
  onSave,
  onDelete,
  onClose,
}: EventFormProps) {
  const initialDate = event
    ? format(parseISO(event.start_at), "yyyy-MM-dd'T'HH:mm")
    : defaultDate
      ? format(defaultDate, "yyyy-MM-dd'T'09:00")
      : format(new Date(), "yyyy-MM-dd'T'09:00")

  const initialEnd = event
    ? format(parseISO(event.end_at), "yyyy-MM-dd'T'HH:mm")
    : defaultDate
      ? format(defaultDate, "yyyy-MM-dd'T'10:00")
      : format(new Date(), "yyyy-MM-dd'T'10:00")

  const [title, setTitle] = useState(event?.title ?? '')
  const [description, setDescription] = useState(event?.description ?? '')
  const [startAt, setStartAt] = useState(initialDate)
  const [endAt, setEndAt] = useState(initialEnd)
  const [allDay, setAllDay] = useState(event?.all_day ?? false)
  const [color, setColor] = useState(event?.color ?? EVENT_COLORS[0])
  const [recurrence, setRecurrence] = useState(event?.recurrence_rule ?? '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const startDate = allDay
      ? `${startAt.split('T')[0]}T00:00:00`
      : new Date(startAt).toISOString()
    const endDate = allDay
      ? `${endAt.split('T')[0]}T23:59:59`
      : new Date(endAt).toISOString()

    onSave({
      title: title.trim(),
      description: description.trim() || null,
      start_at: startDate,
      end_at: endDate,
      all_day: allDay,
      color,
      recurrence_rule: recurrence || null,
      google_event_id: event?.google_event_id ?? null,
      google_calendar_id: event?.google_calendar_id ?? null,
    })
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
      <div
        className="w-full max-w-md rounded-[var(--radius-lg)] border overflow-hidden"
        style={{
          background: 'var(--color-bg-elevated)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
            {event ? 'Edit event' : 'New event'}
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-bg-tertiary)]"
          >
            <X size={14} className="text-[var(--color-text-tertiary)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              autoFocus
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes..."
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)] resize-none"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* All day toggle */}
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="accent-[var(--color-accent)]"
            />
            All day
          </label>

          {/* Date/time pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                Start
              </label>
              <input
                type={allDay ? 'date' : 'datetime-local'}
                value={allDay ? startAt.split('T')[0] : startAt}
                onChange={(e) =>
                  setStartAt(
                    allDay ? `${e.target.value}T00:00` : e.target.value,
                  )
                }
                className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                End
              </label>
              <input
                type={allDay ? 'date' : 'datetime-local'}
                value={allDay ? endAt.split('T')[0] : endAt}
                onChange={(e) =>
                  setEndAt(
                    allDay ? `${e.target.value}T23:59` : e.target.value,
                  )
                }
                className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
              Color
            </label>
            <div className="flex gap-2">
              {EVENT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-full transition-transform"
                  style={{
                    background: c,
                    outline:
                      color === c
                        ? `2px solid ${c}`
                        : '2px solid transparent',
                    outlineOffset: '2px',
                    transform: color === c ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Recurrence */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Repeat
            </label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {RECURRENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {event && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] border text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)] transition-colors disabled:opacity-40"
                style={{ background: 'var(--color-accent)' }}
              >
                {event ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
