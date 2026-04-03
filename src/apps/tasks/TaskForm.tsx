import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { DbTask } from '@/types/database'

const STATUS_OPTIONS: { value: DbTask['status']; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
]

const PRIORITY_OPTIONS: { value: DbTask['priority']; label: string }[] = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

interface TaskFormProps {
  task?: DbTask | null
  onSave: (
    data: Omit<DbTask, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  ) => void
  onDelete?: () => void
  onClose: () => void
}

export function TaskForm({ task, onSave, onDelete, onClose }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState<DbTask['status']>(
    task?.status ?? 'todo',
  )
  const [priority, setPriority] = useState<DbTask['priority']>(
    task?.priority ?? 'medium',
  )
  const [dueDate, setDueDate] = useState(
    task?.due_date ? format(parseISO(task.due_date), 'yyyy-MM-dd') : '',
  )
  const [tagsInput, setTagsInput] = useState(task?.tags?.join(', ') ?? '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    onSave({
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      due_date: dueDate || null,
      tags,
      sort_order: task?.sort_order ?? 0,
      completed_at: status === 'done' ? new Date().toISOString() : null,
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
            {task ? 'Edit task' : 'New task'}
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
              placeholder="Task title"
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
              placeholder="Add details..."
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)] resize-none"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as DbTask['status'])
                }
                className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                style={{ borderColor: 'var(--color-border)' }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as DbTask['priority'])
                }
                className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                style={{ borderColor: 'var(--color-border)' }}
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="design, frontend, bug"
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {task && onDelete && (
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
                {task ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
