import { useState, useEffect, useMemo } from 'react'
import { Plus } from 'lucide-react'
import {
  isToday,
  isTomorrow,
  isPast,
  isThisWeek,
  parseISO,
} from 'date-fns'
import type { DbReminder } from '@/types/database'
import { useReminders } from './hooks'
import { ReminderItem } from './ReminderItem'
import { ReminderForm } from './ReminderForm'
import {
  requestNotificationPermission,
  scheduleUpcomingReminders,
} from './notification-scheduler'

interface ReminderGroup {
  label: string
  color?: string
  reminders: DbReminder[]
}

function groupReminders(reminders: DbReminder[]): ReminderGroup[] {
  const overdue: DbReminder[] = []
  const today: DbReminder[] = []
  const tomorrow: DbReminder[] = []
  const thisWeek: DbReminder[] = []
  const later: DbReminder[] = []

  for (const r of reminders) {
    const date = parseISO(r.remind_at)
    if (isPast(date) && !isToday(date)) {
      overdue.push(r)
    } else if (isToday(date)) {
      today.push(r)
    } else if (isTomorrow(date)) {
      tomorrow.push(r)
    } else if (isThisWeek(date, { weekStartsOn: 0 })) {
      thisWeek.push(r)
    } else {
      later.push(r)
    }
  }

  const groups: ReminderGroup[] = []
  if (overdue.length > 0)
    groups.push({ label: 'Overdue', color: 'var(--color-error)', reminders: overdue })
  if (today.length > 0) groups.push({ label: 'Today', reminders: today })
  if (tomorrow.length > 0) groups.push({ label: 'Tomorrow', reminders: tomorrow })
  if (thisWeek.length > 0) groups.push({ label: 'This week', reminders: thisWeek })
  if (later.length > 0) groups.push({ label: 'Later', reminders: later })

  return groups
}

export function RemindersApp() {
  const [showForm, setShowForm] = useState(false)
  const [editingReminder, setEditingReminder] = useState<DbReminder | null>(
    null,
  )
  const [showCompleted, setShowCompleted] = useState(false)

  const { reminders, isLoading, createReminder, updateReminder, completeReminder, deleteReminder } =
    useReminders({ completed: false })

  const completedData = useReminders({ completed: true })

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  // Schedule browser notifications for upcoming reminders
  useEffect(() => {
    scheduleUpcomingReminders(reminders)
  }, [reminders])

  // Re-schedule on window focus
  useEffect(() => {
    const onFocus = () => scheduleUpcomingReminders(reminders)
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [reminders])

  const groups = useMemo(() => groupReminders(reminders), [reminders])

  function openCreate() {
    setEditingReminder(null)
    setShowForm(true)
  }

  function openEdit(reminder: DbReminder) {
    setEditingReminder(reminder)
    setShowForm(true)
  }

  function handleSave(
    data: Omit<
      DbReminder,
      'id' | 'user_id' | 'created_at' | 'updated_at'
    >,
  ) {
    if (editingReminder) {
      updateReminder.mutate({ id: editingReminder.id, ...data })
    } else {
      createReminder.mutate(data)
    }
    setShowForm(false)
    setEditingReminder(null)
  }

  function handleDelete() {
    if (editingReminder) {
      deleteReminder.mutate(editingReminder.id)
    }
    setShowForm(false)
    setEditingReminder(null)
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-elevated)]">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b shrink-0"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <h2 className="text-sm font-medium text-[var(--color-text-primary)]">
          Reminders
        </h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)] transition-colors hover:opacity-90"
          style={{ background: 'var(--color-accent)' }}
        >
          <Plus size={12} />
          Reminder
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-[var(--color-text-tertiary)]">
              Loading...
            </span>
          </div>
        ) : reminders.length === 0 && !showCompleted ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-sm text-[var(--color-text-tertiary)]">
              No reminders
            </p>
            <button
              onClick={openCreate}
              className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)]"
              style={{ background: 'var(--color-accent)' }}
            >
              Create one
            </button>
          </div>
        ) : (
          <div className="py-2">
            {groups.map((group) => (
              <div key={group.label} className="mb-3">
                <div className="px-4 py-1">
                  <span
                    className="text-[10px] uppercase font-medium tracking-wide"
                    style={{
                      color: group.color ?? 'var(--color-text-tertiary)',
                    }}
                  >
                    {group.label}
                  </span>
                </div>
                {group.reminders.map((reminder) => (
                  <ReminderItem
                    key={reminder.id}
                    reminder={reminder}
                    onComplete={(id) => completeReminder.mutate(id)}
                    onClick={openEdit}
                  />
                ))}
              </div>
            ))}

            {/* Show completed toggle */}
            <div className="px-4 pt-2">
              <button
                onClick={() => setShowCompleted((s) => !s)}
                className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                {showCompleted ? 'Hide' : 'Show'} completed (
                {completedData.reminders.length})
              </button>
            </div>

            {showCompleted && completedData.reminders.length > 0 && (
              <div className="mt-2">
                <div className="px-4 py-1">
                  <span className="text-[10px] uppercase font-medium tracking-wide text-[var(--color-text-tertiary)]">
                    Completed
                  </span>
                </div>
                {completedData.reminders.map((reminder) => (
                  <ReminderItem
                    key={reminder.id}
                    reminder={reminder}
                    onComplete={() => {
                      /* already completed */
                    }}
                    onClick={openEdit}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <ReminderForm
          reminder={editingReminder}
          onSave={handleSave}
          onDelete={editingReminder ? handleDelete : undefined}
          onClose={() => {
            setShowForm(false)
            setEditingReminder(null)
          }}
        />
      )}
    </div>
  )
}
