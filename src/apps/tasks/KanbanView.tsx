import { useMemo, type DragEvent } from 'react'
import type { DbTask } from '@/types/database'
import { TaskCard } from './TaskCard'

const COLUMNS: { status: DbTask['status']; label: string }[] = [
  { status: 'todo', label: 'To do' },
  { status: 'in_progress', label: 'In progress' },
  { status: 'done', label: 'Done' },
  { status: 'cancelled', label: 'Cancelled' },
]

interface KanbanViewProps {
  tasks: DbTask[]
  onTaskClick: (task: DbTask) => void
  onStatusChange: (taskId: string, status: DbTask['status']) => void
}

export function KanbanView({
  tasks,
  onTaskClick,
  onStatusChange,
}: KanbanViewProps) {
  const tasksByStatus = useMemo(() => {
    const map = new Map<DbTask['status'], DbTask[]>()
    for (const col of COLUMNS) {
      map.set(col.status, [])
    }
    for (const task of tasks) {
      const group = map.get(task.status) ?? []
      group.push(task)
      map.set(task.status, group)
    }
    return map
  }, [tasks])

  function handleDragStart(e: DragEvent, task: DbTask) {
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e: DragEvent, status: DbTask['status']) {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      onStatusChange(taskId, status)
    }
  }

  return (
    <div className="h-full flex gap-3 p-4 overflow-x-auto">
      {COLUMNS.map((col) => {
        const colTasks = tasksByStatus.get(col.status) ?? []

        return (
          <div
            key={col.status}
            className="flex-1 min-w-[200px] flex flex-col rounded-[var(--radius-md)]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.status)}
          >
            {/* Column header */}
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                {col.label}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]">
                {colTasks.length}
              </span>
            </div>

            {/* Cards */}
            <div
              className="flex-1 space-y-1.5 p-1 rounded-[var(--radius-md)] min-h-[100px]"
              style={{ background: 'var(--color-bg-secondary)' }}
            >
              {colTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={onTaskClick}
                  draggable
                  onDragStart={handleDragStart}
                />
              ))}
              {colTasks.length === 0 && (
                <div className="flex items-center justify-center h-full min-h-[60px]">
                  <p className="text-[11px] text-[var(--color-text-tertiary)]">
                    Drop tasks here
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
