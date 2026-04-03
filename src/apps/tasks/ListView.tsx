import { useMemo, useState } from 'react'
import type { DbTask } from '@/types/database'
import { TaskCard } from './TaskCard'

type GroupBy = 'status' | 'priority'

const STATUS_ORDER: DbTask['status'][] = [
  'todo',
  'in_progress',
  'done',
  'cancelled',
]

const PRIORITY_ORDER: DbTask['priority'][] = [
  'urgent',
  'high',
  'medium',
  'low',
]

const STATUS_LABELS: Record<string, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
  cancelled: 'Cancelled',
}

const PRIORITY_LABELS: Record<string, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

interface ListViewProps {
  tasks: DbTask[]
  onTaskClick: (task: DbTask) => void
}

export function ListView({ tasks, onTaskClick }: ListViewProps) {
  const [groupBy, setGroupBy] = useState<GroupBy>('status')

  const groups = useMemo(() => {
    const map = new Map<string, DbTask[]>()

    if (groupBy === 'status') {
      for (const status of STATUS_ORDER) {
        map.set(status, [])
      }
    } else {
      for (const priority of PRIORITY_ORDER) {
        map.set(priority, [])
      }
    }

    for (const task of tasks) {
      const key = groupBy === 'status' ? task.status : task.priority
      const group = map.get(key) ?? []
      group.push(task)
      map.set(key, group)
    }

    return map
  }, [tasks, groupBy])

  const labels = groupBy === 'status' ? STATUS_LABELS : PRIORITY_LABELS

  return (
    <div className="h-full flex flex-col">
      {/* Group by toggle */}
      <div className="px-4 py-2 flex items-center gap-2 shrink-0">
        <span className="text-[10px] uppercase text-[var(--color-text-tertiary)]">
          Group by
        </span>
        <div
          className="flex rounded-[var(--radius-md)] border overflow-hidden"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {(['status', 'priority'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={`px-2 py-0.5 text-[11px] capitalize transition-colors ${
                groupBy === g
                  ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {Array.from(groups.entries()).map(([key, groupTasks]) => (
          <div key={key} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                {labels[key] ?? key}
              </span>
              <span className="text-[10px] text-[var(--color-text-tertiary)]">
                {groupTasks.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {groupTasks.length > 0 ? (
                groupTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={onTaskClick}
                  />
                ))
              ) : (
                <p className="text-[11px] text-[var(--color-text-tertiary)] py-2 pl-2">
                  No tasks
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
