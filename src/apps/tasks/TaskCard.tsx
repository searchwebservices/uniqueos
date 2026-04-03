import { format, parseISO, isPast } from 'date-fns'
import { GripVertical } from 'lucide-react'
import type { DbTask } from '@/types/database'
import { cn } from '@/lib/cn'

const PRIORITY_COLORS: Record<DbTask['priority'], string> = {
  urgent: 'var(--color-error)',
  high: '#c4841d',
  medium: 'var(--color-info)',
  low: 'var(--color-text-tertiary)',
}

const STATUS_LABELS: Record<DbTask['status'], string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
  cancelled: 'Cancelled',
}

interface TaskCardProps {
  task: DbTask
  onClick: (task: DbTask) => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent, task: DbTask) => void
}

export function TaskCard({ task, onClick, draggable, onDragStart }: TaskCardProps) {
  const priorityColor = PRIORITY_COLORS[task.priority]
  const isOverdue =
    task.due_date && task.status !== 'done' && task.status !== 'cancelled' && isPast(parseISO(task.due_date))

  return (
    <div
      className={cn(
        'group flex items-start gap-2 p-3 rounded-[var(--radius-md)] border cursor-pointer transition-colors hover:bg-[var(--color-bg-secondary)]',
        task.status === 'done' && 'opacity-60',
        task.status === 'cancelled' && 'opacity-40',
      )}
      style={{ borderColor: 'var(--color-border-subtle)' }}
      onClick={() => onClick(task)}
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task)}
    >
      {draggable && (
        <GripVertical
          size={14}
          className="mt-0.5 shrink-0 text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
        />
      )}

      {/* Priority indicator */}
      <div
        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
        style={{ background: priorityColor }}
        title={task.priority}
      />

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            'text-sm text-[var(--color-text-primary)]',
            task.status === 'done' && 'line-through',
          )}
        >
          {task.title}
        </div>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {/* Status badge */}
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]">
            {STATUS_LABELS[task.status]}
          </span>

          {/* Due date */}
          {task.due_date && (
            <span
              className={cn(
                'text-[10px]',
                isOverdue
                  ? 'text-[var(--color-error)] font-medium'
                  : 'text-[var(--color-text-tertiary)]',
              )}
            >
              {format(parseISO(task.due_date), 'MMM d')}
            </span>
          )}

          {/* Tags */}
          {task.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-[var(--radius-full)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
