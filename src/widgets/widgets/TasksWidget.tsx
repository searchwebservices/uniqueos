import { useWindowStore } from '@/stores/window-store'
import { useTasks } from '@/hooks/useTasks'
import type { WidgetProps } from '@/types/os'

const PRIORITY_COLORS: Record<string, string> = {
  high: 'var(--color-error)',
  medium: 'var(--color-warning)',
  low: 'var(--color-success)',
  urgent: 'var(--color-error)',
}

function formatDue(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function TasksWidget(_props: WidgetProps) {
  const openWindow = useWindowStore((s) => s.openWindow)
  const { tasks, isLoading, updateTask } = useTasks()

  // Show only incomplete tasks, max 5
  const visible = tasks
    .filter((t) => t.status !== 'done' && t.status !== 'cancelled')
    .slice(0, 5)

  function toggleTask(id: string, currentStatus: string) {
    updateTask.mutate({
      id,
      status: currentStatus === 'done' ? 'todo' : 'done',
    })
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
              No tasks
            </span>
          </div>
        ) : (
          visible.map((task) => {
            const isDone = task.status === 'done'
            return (
              <div
                key={task.id}
                className="flex items-center gap-2 py-1 px-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                <button
                  onClick={() => toggleTask(task.id, task.status)}
                  className="shrink-0 w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors"
                  style={{
                    borderColor: isDone ? 'var(--color-success)' : 'var(--color-border-strong)',
                    background: isDone ? 'var(--color-success)' : 'transparent',
                  }}
                >
                  {isDone && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  <div
                    className="shrink-0 w-1.5 h-1.5 rounded-full"
                    style={{ background: PRIORITY_COLORS[task.priority] ?? 'var(--color-text-tertiary)' }}
                  />
                  <span
                    className="text-[11px] truncate"
                    style={{
                      color: isDone ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                      textDecoration: isDone ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </span>
                </div>

                <span
                  className="shrink-0 text-[10px]"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {formatDue(task.due_date)}
                </span>
              </div>
            )
          })
        )}
      </div>

      <button
        onClick={() => openWindow('tasks')}
        className="text-[11px] font-medium py-1 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
        style={{ color: 'var(--color-accent)' }}
      >
        View all
      </button>
    </div>
  )
}
