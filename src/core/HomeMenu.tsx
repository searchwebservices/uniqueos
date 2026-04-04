import { useState, useEffect, useRef } from 'react'
import { Search, Minus, X, LogOut } from 'lucide-react'
import { useWindowStore } from '@/stores/window-store'
import { useCommandPaletteStore } from '@/stores/command-palette-store'
import { useAuth } from '@/providers/AuthProvider'
import { getApp } from '@/lib/app-registry'
import { cn } from '@/lib/cn'

function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000 * 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="text-sm font-medium text-[var(--color-text-primary)]">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  )
}

export function HomeMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const windows = useWindowStore(s => s.windows)
  const focusWindow = useWindowStore(s => s.focusWindow)
  const minimizeWindow = useWindowStore(s => s.minimizeWindow)
  const closeWindow = useWindowStore(s => s.closeWindow)
  const openPalette = useCommandPaletteStore(s => s.open)
  const { signOut } = useAuth()

  useEffect(() => {
    if (!open) return

    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const openWindows = windows.filter(w => w.state !== 'minimized')
  const minimizedWindows = windows.filter(w => w.state === 'minimized')
  const allWindows = [...openWindows, ...minimizedWindows]

  return (
    <>
      {/* Home button — bottom left, level with dock */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(o => !o)}
        className={cn(
          'fixed z-[1001] w-11 h-11',
          'flex items-center justify-center',
          'hover:scale-110 active:scale-95 transition-all duration-150',
        )}
        style={{
          bottom: 'calc((var(--dock-height) - 44px) / 2)',
          left: '12px',
        }}
        aria-label="Home menu"
      >
        <img
          src="/ucw-logo-black.png"
          alt="UCW"
          className={cn(
            'w-8 h-8 object-contain transition-opacity',
            open ? 'opacity-100' : 'opacity-60 hover:opacity-100'
          )}
        />
      </button>

      {/* Menu popup */}
      {open && (
        <div
          ref={menuRef}
          className="fixed z-[1002] w-64 rounded-[var(--radius-lg)] border overflow-hidden animate-in scale-in duration-150"
          style={{
            bottom: 'calc(var(--dock-height) + 8px)',
            left: '12px',
            background: 'var(--color-bg-elevated)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Brand + Clock */}
          <div className="px-4 pt-3 pb-2 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <p className="text-xs font-medium text-[var(--color-text-tertiary)]">UniqueOS</p>
            <Clock />
          </div>

          {/* Search */}
          <button
            onClick={() => {
              setOpen(false)
              openPalette()
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors border-b"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            <Search size={14} />
            <span className="flex-1 text-left">Buscar...</span>
            <kbd className="text-[10px] opacity-50">
              {navigator.platform?.includes('Mac') ? '\u2318' : 'Ctrl+'}K
            </kbd>
          </button>

          {/* Open Apps */}
          <div className="py-1">
            {allWindows.length > 0 ? (
              <>
                <p className="px-4 py-1.5 text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                  Apps abiertas
                </p>
                {allWindows.map(win => {
                  const app = getApp(win.appId)
                  if (!app) return null
                  const Icon = app.icon
                  const isMinimized = win.state === 'minimized'

                  return (
                    <div
                      key={win.id}
                      className={cn(
                        'flex items-center gap-2.5 px-4 py-1.5 text-xs cursor-pointer hover:bg-[var(--color-bg-tertiary)] transition-colors',
                        isMinimized && 'opacity-50'
                      )}
                      onClick={() => {
                        focusWindow(win.id)
                        setOpen(false)
                      }}
                    >
                      <Icon size={14} className="text-[var(--color-text-secondary)] shrink-0" />
                      <span className="flex-1 truncate text-[var(--color-text-primary)]">{win.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isMinimized) {
                            focusWindow(win.id)
                          } else {
                            minimizeWindow(win.id)
                          }
                        }}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]"
                        title={isMinimized ? 'Restore' : 'Minimize'}
                      >
                        <Minus size={10} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          closeWindow(win.id)
                        }}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)] hover:text-[var(--color-error)]"
                        title="Close"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )
                })}
              </>
            ) : (
              <p className="px-4 py-3 text-xs text-[var(--color-text-tertiary)] text-center">
                No hay apps abiertas
              </p>
            )}
          </div>

          {/* Sign out */}
          <div className="border-t py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <button
              onClick={async () => {
                await signOut()
                setOpen(false)
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--color-error)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <LogOut size={14} />
              Cerrar sesion
            </button>
          </div>
        </div>
      )}
    </>
  )
}
