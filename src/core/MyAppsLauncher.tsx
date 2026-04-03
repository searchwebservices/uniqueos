import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { getAllApps } from '@/lib/app-registry'
import { useWindowStore } from '@/stores/window-store'
import { useDesktopApps } from '@/stores/desktop-apps-store'
import type { AppCategory } from '@/types/os'

const CATEGORY_LABELS: Record<AppCategory, string> = {
  productivity: 'Productividad',
  creative: 'Creativo',
  utility: 'Utilidades',
  system: 'Sistema',
}

const CATEGORY_ORDER: AppCategory[] = ['productivity', 'creative', 'utility', 'system']

export function MyAppsLauncher() {
  const launcherOpen = useDesktopApps((s) => s.launcherOpen)
  const closeLauncher = useDesktopApps((s) => s.closeLauncher)

  if (!launcherOpen) return null

  return <LauncherOverlay onClose={closeLauncher} />
}

function LauncherOverlay({ onClose }: { onClose: () => void }) {
  const apps = getAllApps()
  const openWindow = useWindowStore((s) => s.openWindow)

  const [search, setSearch] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const filtered = useMemo(() => {
    if (!search) return apps
    const q = search.toLowerCase()
    return apps.filter(
      (app) =>
        app.title.toLowerCase().includes(q) ||
        app.appId.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q),
    )
  }, [apps, search])

  const grouped = useMemo(() => {
    const map = new Map<AppCategory, typeof filtered>()
    for (const cat of CATEGORY_ORDER) {
      const items = filtered.filter((a) => a.category === cat)
      if (items.length > 0) map.set(cat, items)
    }
    return map
  }, [filtered])

  const handleOpenApp = useCallback(
    (appId: string) => {
      openWindow(appId)
      onClose()
    },
    [openWindow, onClose],
  )

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 animate-in fade-in duration-200"
        style={{
          zIndex: 2000,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        onClick={onClose}
      />

      {/* Content */}
      <div
        className="fixed inset-0 flex flex-col items-center animate-in fade-in duration-200"
        style={{ zIndex: 2001 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mt-8 mb-6 w-full max-w-[600px] px-4">
          <div
            className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-lg)]"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <Search size={16} className="text-white/50 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar apps..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-white/40 hover:text-white/70">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <X size={18} className="text-white/70" />
          </button>
        </div>

        {/* App grid */}
        <div className="flex-1 overflow-y-auto w-full max-w-[700px] px-6 pb-12">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-white/40">No se encontraron apps</p>
            </div>
          ) : (
            Array.from(grouped.entries()).map(([category, categoryApps]) => (
              <div key={category} className="mb-8">
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4 px-1">
                  {CATEGORY_LABELS[category]}
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {categoryApps.map((app) => {
                    const Icon = app.icon

                    return (
                      <button
                        key={app.appId}
                        onClick={() => handleOpenApp(app.appId)}
                        className="group flex flex-col items-center gap-2 p-3 rounded-[var(--radius-lg)] transition-all hover:bg-white/10 active:scale-95"
                      >
                        <div
                          className="w-14 h-14 flex items-center justify-center rounded-[var(--radius-lg)] transition-transform group-hover:scale-105"
                          style={{
                            background: 'rgba(255,255,255,0.12)',
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <Icon size={26} className="text-white/85" />
                        </div>
                        <span className="text-[11px] text-white/80 text-center leading-tight line-clamp-2 w-full">
                          {app.title}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Hint */}
        <div className="pb-6">
          <p className="text-[10px] text-white/30">
            Click para abrir una app.
          </p>
        </div>
      </div>
    </>
  )
}
