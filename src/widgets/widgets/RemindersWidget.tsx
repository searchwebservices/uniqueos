import { Clock, RotateCw } from 'lucide-react'
import { useWindowStore } from '@/stores/window-store'
import { useReminders } from '@/hooks/useReminders'
import type { WidgetProps } from '@/types/os'

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function RemindersWidget(_props: WidgetProps) {
  const openWindow = useWindowStore((s) => s.openWindow)
  const { reminders, isLoading, completeReminder } = useReminders({ completed: false })

  // Show max 4 upcoming reminders
  const visible = reminders.slice(0, 4)

  function toggleReminder(id: string) {
    completeReminder.mutate(id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-[11px] text-[var(--color-text-tertiary)]">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-1.5">
      <div className="flex flex-col gap-0.5 flex-1 min-h-0 overflow-auto">
        {visible.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-[11px] text-[var(--color-text-tertiary)]">
              No reminders
            </span>
          </div>
        ) : (
          visible.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center gap-2 py-1.5 px-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <button
                onClick={() => toggleReminder(reminder.id)}
                className="shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-colors"
                style={{
                  borderColor: reminder.completed ? 'var(--color-success)' : 'var(--color-border-strong)',
                  background: reminder.completed ? 'var(--color-success)' : 'transparent',
                }}
              >
                {reminder.completed && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <span
                  className="text-[11px] block truncate"
                  style={{
                    color: reminder.completed ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                    textDecoration: reminder.completed ? 'line-through' : 'none',
                  }}
                >
                  {reminder.title}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock size={9} className="text-[var(--color-text-tertiary)]" />
                  <span
                    className="text-[10px]"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {formatTime(reminder.remind_at)}
                  </span>
                  {reminder.repeat !== 'none' && (
                    <span
                      className="inline-flex items-center gap-0.5 text-[9px] px-1 py-px rounded-[var(--radius-sm)]"
                      style={{
                        background: 'var(--color-accent-subtle)',
                        color: 'var(--color-accent)',
                      }}
                    >
                      <RotateCw size={7} />
                      {reminder.repeat}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => openWindow('reminders')}
        className="text-[11px] font-medium py-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
        style={{ color: 'var(--color-accent)' }}
      >
        View all
      </button>
    </div>
  )
}
