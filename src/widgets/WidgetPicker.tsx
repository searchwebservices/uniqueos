import {
  Clock,
  Calendar,
  CheckSquare,
  Bell,
  Cloud,
  StickyNote,
  Monitor,
  X,
} from 'lucide-react'
import { useWidgetStore } from '@/stores/widget-store'
import { getAllWidgetTypes } from './registry'
import type { LucideIcon } from 'lucide-react'

interface Props {
  onClose: () => void
}

const widgetIcons: Record<string, LucideIcon> = {
  clock: Clock,
  'calendar-mini': Calendar,
  'tasks-mini': CheckSquare,
  'reminders-mini': Bell,
  weather: Cloud,
  'quick-note': StickyNote,
  'system-stats': Monitor,
}

const widgetDescriptions: Record<string, string> = {
  clock: 'Current time and date',
  'calendar-mini': 'Mini month calendar',
  'tasks-mini': 'Top tasks by priority',
  'reminders-mini': 'Upcoming reminders',
  weather: 'Weather at a glance',
  'quick-note': 'Jot down quick notes',
  'system-stats': 'Browser and system info',
}

export function WidgetPicker({ onClose }: Props) {
  const enterPlacementMode = useWidgetStore((s) => s.enterPlacementMode)
  const widgetTypes = getAllWidgetTypes()

  function handleSelect(type: string) {
    enterPlacementMode(type)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 2000 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
      />

      {/* Panel */}
      <div
        className="relative w-[480px] max-h-[70vh] overflow-auto"
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
        >
          <h2
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Add widget
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3 p-5">
          {widgetTypes.map((wt) => {
            const Icon = widgetIcons[wt.type] ?? Monitor
            const description = widgetDescriptions[wt.type] ?? ''

            return (
              <button
                key={wt.type}
                onClick={() => handleSelect(wt.type)}
                className="flex flex-col items-center gap-2 p-4 rounded-[var(--radius-md)] transition-colors text-center"
                style={{
                  border: '1px solid var(--color-border-subtle)',
                  background: 'var(--color-bg-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent)'
                  e.currentTarget.style.background = 'var(--color-accent-subtle)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)'
                  e.currentTarget.style.background = 'var(--color-bg-secondary)'
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)]"
                  style={{
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <Icon
                    size={20}
                    className="text-[var(--color-text-secondary)]"
                  />
                </div>
                <div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {wt.title}
                  </div>
                  <div
                    className="text-[10px] mt-0.5"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
