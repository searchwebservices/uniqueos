import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { DbReminder } from '@/types/database'

const REPEAT_OPTIONS: { value: DbReminder['repeat']; label: string }[] = [
  { value: 'none', label: 'No repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

interface ReminderFormProps {
  reminder?: DbReminder | null
  onSave: (
    data: Omit<
      DbReminder,
      'id' | 'user_id' | 'created_at' | 'updated_at'
    >,
  ) => void
  onDelete?: () => void
  onClose: () => void
}

export function ReminderForm({
  reminder,
  onSave,
  onDelete,
  onClose,
}: ReminderFormProps) {
  const [title, setTitle] = useState(reminder?.title ?? '')
  const [notes, setNotes] = useState(reminder?.notes ?? '')
  const [remindAt, setRemindAt] = useState(
    reminder
      ? format(parseISO(reminder.remind_at), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  )
  const [repeat, setRepeat] = useState<DbReminder['repeat']>(
    reminder?.repeat ?? 'none',
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      notes: notes.trim() || null,
      remind_at: new Date(remindAt).toISOString(),
      repeat,
      completed: reminder?.completed ?? false,
      completed_at: reminder?.completed_at ?? null,
    })
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
      <div
        className="w-full max-w-sm rounded-[var(--radius-lg)] border overflow-hidden"
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
            {reminder ? 'Edit reminder' : 'New reminder'}
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-bg-tertiary)]"
          >
            <X size={14} className="text-[var(--color-text-tertiary)]" />
          </button>
        </div>

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
              placeholder="Remind me to..."
              autoFocus
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details..."
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)] resize-none"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* Date/time */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              When
            </label>
            <input
              type="datetime-local"
              value={remindAt}
              onChange={(e) => setRemindAt(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* Repeat */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Repeat
            </label>
            <select
              value={repeat}
              onChange={(e) =>
                setRepeat(e.target.value as DbReminder['repeat'])
              }
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {REPEAT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {reminder && onDelete && (
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
                {reminder ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
