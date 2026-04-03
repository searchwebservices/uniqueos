import { format, parseISO } from 'date-fns'
import { Repeat } from 'lucide-react'
import type { DbReminder } from '@/types/database'
import { cn } from '@/lib/cn'

interface ReminderItemProps {
  reminder: DbReminder
  onComplete: (id: string) => void
  onClick: (reminder: DbReminder) => void
}

export function ReminderItem({ reminder, onComplete, onClick }: ReminderItemProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--color-bg-secondary)] cursor-pointer',
        reminder.completed && 'opacity-50',
      )}
      onClick={() => onClick(reminder)}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onComplete(reminder.id)
        }}
        className={cn(
          'mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors',
          reminder.completed
            ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
            : 'border-[var(--color-border-strong)] hover:border-[var(--color-accent)]',
        )}
      >
        {reminder.completed && (
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            stroke="var(--color-text-inverse)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1.5 4L3.5 6L6.5 2" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            'text-sm text-[var(--color-text-primary)]',
            reminder.completed && 'line-through',
          )}
        >
          {reminder.title}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-[var(--color-text-tertiary)]">
            {format(parseISO(reminder.remind_at), 'h:mm a')}
          </span>
          {reminder.repeat !== 'none' && (
            <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-[var(--radius-full)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
              <Repeat size={8} />
              {reminder.repeat}
            </span>
          )}
        </div>
        {reminder.notes && (
          <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5 truncate">
            {reminder.notes}
          </p>
        )}
      </div>
    </div>
  )
}
