import { useEffect } from 'react'
import { useDockStore } from '@/stores/dock-store'
import { getDockDefaultApps } from '@/lib/app-registry'
import { DockItem } from './DockItem'

export function Dock() {
  const items = useDockStore(s => s.items)
  const setItems = useDockStore(s => s.setItems)

  // Initialize dock with default apps on first mount
  useEffect(() => {
    if (items.length === 0) {
      const defaults = getDockDefaultApps()
      setItems(defaults.map((app, idx) => ({ appId: app.appId, order: idx })))
    }
  }, [items.length, setItems])

  return (
    <div
      className="fixed bottom-0 inset-x-0 flex items-center justify-center px-2 py-2"
      style={{ zIndex: 1000, height: 'var(--dock-height)' }}
    >
      <div
        className="flex items-center gap-1 px-2 py-1.5 rounded-[var(--radius-xl)] border backdrop-blur-md"
        style={{
          background: 'var(--color-dock-bg)',
          borderColor: 'var(--color-dock-border)',
        }}
      >
        {items
          .sort((a, b) => a.order - b.order)
          .map(item => (
            <DockItem key={item.appId} appId={item.appId} />
          ))}
      </div>
    </div>
  )
}
