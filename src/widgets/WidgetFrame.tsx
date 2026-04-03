import { useState, Suspense } from 'react'
import { GripHorizontal, X } from 'lucide-react'
import { useWidgetStore } from '@/stores/widget-store'
import { getWidgetType } from './registry'
import type { WidgetInstance } from '@/types/os'

interface Props {
  widget: WidgetInstance
}

export function WidgetFrame({ widget }: Props) {
  const removeWidget = useWidgetStore((s) => s.removeWidget)
  const [hovered, setHovered] = useState(false)

  const entry = getWidgetType(widget.type)
  if (!entry) return null

  const WidgetComponent = entry.component

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        pointerEvents: 'auto',
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drag handle bar */}
      <div
        className="widget-drag-handle flex items-center justify-between px-2 shrink-0"
        style={{
          height: 28,
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <GripHorizontal
            size={12}
            className="text-[var(--color-text-tertiary)]"
          />
          <span
            className="text-[11px] font-medium select-none"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {entry.title}
          </span>
        </div>

        <button
          onClick={() => removeWidget(widget.id)}
          className="flex items-center justify-center w-5 h-5 rounded-[var(--radius-sm)] transition-colors"
          style={{
            opacity: hovered ? 1 : 0,
            background: hovered ? 'var(--color-bg-tertiary)' : 'transparent',
            color: 'var(--color-text-tertiary)',
          }}
          aria-label="Remove widget"
        >
          <X size={12} />
        </button>
      </div>

      {/* Widget content */}
      <div className="flex-1 min-h-0 overflow-auto p-2">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <WidgetComponent widgetId={widget.id} config={widget.config} />
        </Suspense>
      </div>
    </div>
  )
}
