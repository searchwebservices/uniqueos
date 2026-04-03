import { useState } from 'react'
import { Plus, LayoutList, Columns } from 'lucide-react'
import type { DbTask } from '@/types/database'
import { useTasks } from './hooks'
import { ListView } from './ListView'
import { KanbanView } from './KanbanView'
import { TaskForm } from './TaskForm'
import { cn } from '@/lib/cn'

type TaskView = 'list' | 'kanban'

export function TasksApp() {
  const [view, setView] = useState<TaskView>('list')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<DbTask | null>(null)

  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks()

  function openCreate() {
    setEditingTask(null)
    setShowForm(true)
  }

  function openEdit(task: DbTask) {
    setEditingTask(task)
    setShowForm(true)
  }

  function handleSave(
    data: Omit<DbTask, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  ) {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, ...data })
    } else {
      createTask.mutate(data)
    }
    setShowForm(false)
    setEditingTask(null)
  }

  function handleDelete() {
    if (editingTask) {
      deleteTask.mutate(editingTask.id)
    }
    setShowForm(false)
    setEditingTask(null)
  }

  function handleStatusChange(taskId: string, status: DbTask['status']) {
    updateTask.mutate({ id: taskId, status })
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-elevated)]">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b shrink-0"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <h2 className="text-sm font-medium text-[var(--color-text-primary)]">
          Tasks
        </h2>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div
            className="flex rounded-[var(--radius-md)] border overflow-hidden"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <button
              onClick={() => setView('list')}
              className={cn(
                'p-1.5 transition-colors',
                view === 'list'
                  ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]',
              )}
              title="List view"
            >
              <LayoutList size={13} />
            </button>
            <button
              onClick={() => setView('kanban')}
              className={cn(
                'p-1.5 transition-colors',
                view === 'kanban'
                  ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]',
              )}
              title="Kanban view"
            >
              <Columns size={13} />
            </button>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)] transition-colors hover:opacity-90"
            style={{ background: 'var(--color-accent)' }}
          >
            <Plus size={12} />
            Task
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-[var(--color-text-tertiary)]">
              Loading...
            </span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-sm text-[var(--color-text-tertiary)]">
              No tasks yet
            </p>
            <button
              onClick={openCreate}
              className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)]"
              style={{ background: 'var(--color-accent)' }}
            >
              Create first task
            </button>
          </div>
        ) : view === 'list' ? (
          <ListView tasks={tasks} onTaskClick={openEdit} />
        ) : (
          <KanbanView
            tasks={tasks}
            onTaskClick={openEdit}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      {/* Task form modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSave}
          onDelete={editingTask ? handleDelete : undefined}
          onClose={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}
