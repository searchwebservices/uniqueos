import { useState, useCallback, useRef } from 'react'
import { getAllApps } from '@/lib/app-registry'
import { useWidgetStore } from '@/stores/widget-store'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { useThemeStore } from '@/stores/theme-store'
import { resolveWallpaper } from '@/lib/wallpapers'
import { getWidgetType } from '@/widgets/registry'
import { DesktopIcon } from './DesktopIcon'
import { WhatsAppShortcutIcon } from './WhatsAppShortcutIcon'
import { WhatsAppShortcutForm } from './WhatsAppShortcutForm'
import { useWhatsAppShortcuts } from '@/hooks/useWhatsAppShortcuts'
import { WidgetGrid } from '@/widgets/WidgetGrid'
import { WidgetPicker } from '@/widgets/WidgetPicker'
import { DesktopContextMenu } from '@/widgets/DesktopContextMenu'
import type { WidgetInstance } from '@/types/os'

const GRID_COLS = 24
const ROW_HEIGHT = 40

export function DesktopSurface() {
  const apps = getAllApps()
  const wallpaper = useThemeStore((s) => s.wallpaper)
  const wallpaperStyle = resolveWallpaper(wallpaper)
  const placementMode = useWidgetStore((s) => s.placementMode)
  const addWidget = useWidgetStore((s) => s.addWidget)
  const exitPlacementMode = useWidgetStore((s) => s.exitPlacementMode)
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)

  const { shortcuts } = useWhatsAppShortcuts()

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [showWAForm, setShowWAForm] = useState(false)

  // Draw-to-place state
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  // --- Draw-to-place handlers ---
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!placementMode.active || !surfaceRef.current) return
      // Only left click
      if (e.button !== 0) return

      const rect = surfaceRef.current.getBoundingClientRect()
      setDrawStart({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setDrawCurrent({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    },
    [placementMode.active]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!drawStart || !surfaceRef.current) return
      const rect = surfaceRef.current.getBoundingClientRect()
      setDrawCurrent({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    },
    [drawStart]
  )

  const handleMouseUp = useCallback(() => {
    if (!drawStart || !drawCurrent || !surfaceRef.current || !placementMode.widgetType) {
      setDrawStart(null)
      setDrawCurrent(null)
      return
    }

    const rect = surfaceRef.current.getBoundingClientRect()
    const colWidth = rect.width / GRID_COLS

    // Calculate grid position from draw rectangle
    const minX = Math.min(drawStart.x, drawCurrent.x)
    const minY = Math.min(drawStart.y, drawCurrent.y)
    const drawW = Math.abs(drawCurrent.x - drawStart.x)
    const drawH = Math.abs(drawCurrent.y - drawStart.y)

    const gridX = Math.round(minX / colWidth)
    const gridY = Math.round(minY / ROW_HEIGHT)

    const entry = getWidgetType(placementMode.widgetType)
    const defaultSize = entry?.defaultSize ?? { w: 4, h: 3 }
    const minSize = entry?.minSize ?? { w: 2, h: 2 }

    // If user drew a meaningful rectangle, use its size; otherwise use defaults
    let gridW: number
    let gridH: number
    if (drawW > 30 && drawH > 30) {
      gridW = Math.max(minSize.w, Math.round(drawW / colWidth))
      gridH = Math.max(minSize.h, Math.round(drawH / ROW_HEIGHT))
    } else {
      gridW = defaultSize.w
      gridH = defaultSize.h
    }

    // Clamp to max size
    if (entry?.maxSize) {
      gridW = Math.min(gridW, entry.maxSize.w)
      gridH = Math.min(gridH, entry.maxSize.h)
    }

    const newWidget: WidgetInstance = {
      id: `widget-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: placementMode.widgetType,
      workspaceId: activeWorkspaceId,
      layout: {
        x: Math.max(0, Math.min(gridX, GRID_COLS - gridW)),
        y: Math.max(0, gridY),
        w: gridW,
        h: gridH,
      },
      config: {},
      hidden: false,
    }

    addWidget(newWidget)
    exitPlacementMode()
    setDrawStart(null)
    setDrawCurrent(null)
  }, [drawStart, drawCurrent, placementMode, addWidget, exitPlacementMode, activeWorkspaceId])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && placementMode.active) {
        exitPlacementMode()
        setDrawStart(null)
        setDrawCurrent(null)
      }
    },
    [placementMode.active, exitPlacementMode]
  )

  // Compute draw overlay rectangle
  const drawRect =
    drawStart && drawCurrent
      ? {
          left: Math.min(drawStart.x, drawCurrent.x),
          top: Math.min(drawStart.y, drawCurrent.y),
          width: Math.abs(drawCurrent.x - drawStart.x),
          height: Math.abs(drawCurrent.y - drawStart.y),
        }
      : null

  return (
    <div
      ref={surfaceRef}
      className="fixed inset-0 overflow-hidden outline-none"
      style={{
        top: 'var(--topbar-height)',
        bottom: 'var(--dock-height)',
        zIndex: 0,
        background: wallpaperStyle.background,
        backgroundSize: wallpaperStyle.backgroundSize,
        cursor: placementMode.active ? 'crosshair' : undefined,
      }}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Desktop icons layer (z-10) */}
      <div className="absolute inset-0" style={{ zIndex: 10, pointerEvents: placementMode.active ? 'none' : undefined }}>
        <div className="flex flex-wrap content-start gap-2 p-4">
          {apps.map((app) => (
            <DesktopIcon key={app.appId} app={app} />
          ))}
          {shortcuts.map((sc) => (
            <WhatsAppShortcutIcon key={sc.id} shortcut={sc} />
          ))}
        </div>
      </div>

      {/* Widget grid layer (z-20) — pointer-events:none on container so icons beneath are clickable, widgets opt back in */}
      <div className="absolute inset-0" style={{ zIndex: 20, pointerEvents: 'none' }}>
        <WidgetGrid />
      </div>

      {/* Draw-to-place overlay (z-30) */}
      {placementMode.active && drawRect && drawRect.width > 5 && drawRect.height > 5 && (
        <div
          className="absolute pointer-events-none"
          style={{
            zIndex: 30,
            left: drawRect.left,
            top: drawRect.top,
            width: drawRect.width,
            height: drawRect.height,
            border: '2px dashed var(--color-accent)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent-subtle)',
          }}
        />
      )}

      {/* Placement mode hint */}
      {placementMode.active && !drawStart && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-[var(--radius-lg)]"
          style={{
            zIndex: 30,
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            pointerEvents: 'none',
          }}
        >
          <span
            className="text-xs"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Click and drag to place widget. Press Esc to cancel.
          </span>
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAddWidget={() => setShowPicker(true)}
          onAddWhatsAppShortcut={() => setShowWAForm(true)}
        />
      )}

      {/* Widget picker modal */}
      {showPicker && <WidgetPicker onClose={() => setShowPicker(false)} />}

      {/* WhatsApp shortcut form */}
      {showWAForm && <WhatsAppShortcutForm onClose={() => setShowWAForm(false)} />}
    </div>
  )
}
