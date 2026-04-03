import { useDockStore } from '@/stores/dock-store'
import { getAllApps } from '@/lib/app-registry'
import { GripVertical, Eye, EyeOff } from 'lucide-react'
import { useMemo, type DragEvent, useState } from 'react'

export function DockSettings() {
  const items = useDockStore((s) => s.items)
  const addItem = useDockStore((s) => s.addItem)
  const removeItem = useDockStore((s) => s.removeItem)
  const reorder = useDockStore((s) => s.reorder)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const allApps = useMemo(() => getAllApps(), [])
  const dockAppIds = new Set(items.map((i) => i.appId))
  const hiddenApps = allApps.filter((a) => !dockAppIds.has(a.appId))

  function handleDragStart(e: DragEvent, index: number) {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(_e: DragEvent, targetIndex: number) {
    if (dragIndex !== null && dragIndex !== targetIndex) {
      reorder(dragIndex, targetIndex)
    }
    setDragIndex(null)
  }

  return (
    <div className="space-y-6">
      {/* Active dock items */}
      <section>
        <h3 className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">
          Dock apps (drag to reorder)
        </h3>
        <div className="space-y-1">
          {items.map((item, index) => {
            const app = allApps.find((a) => a.appId === item.appId)
            if (!app) return null

            const Icon = app.icon

            return (
              <div
                key={item.appId}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] border hover:bg-[var(--color-bg-secondary)] transition-colors cursor-grab"
                style={{ borderColor: 'var(--color-border-subtle)' }}
              >
                <GripVertical
                  size={12}
                  className="text-[var(--color-text-tertiary)]"
                />
                <Icon
                  size={14}
                  className="text-[var(--color-text-secondary)]"
                />
                <span className="flex-1 text-sm text-[var(--color-text-primary)]">
                  {app.title}
                </span>
                <button
                  onClick={() => removeItem(item.appId)}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-bg-tertiary)] transition-colors"
                  title="Hide from dock"
                >
                  <EyeOff
                    size={12}
                    className="text-[var(--color-text-tertiary)]"
                  />
                </button>
              </div>
            )
          })}
          {items.length === 0 && (
            <p className="text-[11px] text-[var(--color-text-tertiary)] py-2">
              No apps in dock
            </p>
          )}
        </div>
      </section>

      {/* Hidden apps */}
      {hiddenApps.length > 0 && (
        <section>
          <h3 className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">
            Hidden apps
          </h3>
          <div className="space-y-1">
            {hiddenApps.map((app) => {
              const Icon = app.icon
              return (
                <div
                  key={app.appId}
                  className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] border opacity-60 hover:opacity-100 transition-opacity"
                  style={{ borderColor: 'var(--color-border-subtle)' }}
                >
                  <div className="w-3" />
                  <Icon
                    size={14}
                    className="text-[var(--color-text-tertiary)]"
                  />
                  <span className="flex-1 text-sm text-[var(--color-text-secondary)]">
                    {app.title}
                  </span>
                  <button
                    onClick={() => addItem(app.appId)}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    title="Show in dock"
                  >
                    <Eye
                      size={12}
                      className="text-[var(--color-text-tertiary)]"
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
