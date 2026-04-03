import { useEffect, useState } from 'react'
import { LayoutGrid } from 'lucide-react'
import { useDockStore } from '@/stores/dock-store'
import { useDesktopApps } from '@/stores/desktop-apps-store'
import { getDockDefaultApps } from '@/lib/app-registry'
import { DockItem } from './DockItem'

export function Dock() {
  const items = useDockStore(s => s.items)
  const setItems = useDockStore(s => s.setItems)
  const toggleLauncher = useDesktopApps(s => s.toggleLauncher)
  const launcherOpen = useDesktopApps(s => s.launcherOpen)
  const [showTooltip, setShowTooltip] = useState(false)

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
        {/* My Apps button — always first, not removable */}
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {showTooltip && (
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-[var(--radius-sm)] text-[10px] font-medium whitespace-nowrap pointer-events-none"
              style={{
                background: 'var(--color-text-primary)',
                color: 'var(--color-text-inverse)',
              }}
            >
              Apps
            </div>
          )}
          <button
            onClick={toggleLauncher}
            className={`relative w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-bg-tertiary)] active:scale-95 transition-all duration-100 ${
              launcherOpen ? 'bg-[var(--color-accent-subtle)]' : ''
            }`}
            aria-label="My Apps"
          >
            <LayoutGrid
              size={22}
              className={
                launcherOpen
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-text-primary)]'
              }
            />
          </button>
        </div>

        {/* Divider */}
        <div
          className="w-px h-7 mx-0.5"
          style={{ background: 'var(--color-border-subtle)' }}
        />

        {/* Regular dock items */}
        {items
          .sort((a, b) => a.order - b.order)
          .map(item => (
            <DockItem key={item.appId} appId={item.appId} />
          ))}
      </div>
    </div>
  )
}
