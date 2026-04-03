import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { getAllApps, getApp } from '@/lib/app-registry'
import { getIconKey } from '@/lib/icon-library'
import { useWidgetStore, usePlacementMode } from '@/stores/widget-store'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { useThemeStore } from '@/stores/theme-store'
import { useDesktopSelection, type DesktopItemType } from '@/stores/desktop-selection-store'
import { useDesktopLayout, ICON_CELL_W, ICON_CELL_H } from '@/stores/desktop-layout-store'
import { useDesktopApps } from '@/stores/desktop-apps-store'
import { resolveWallpaper, getWallpaperTone } from '@/lib/wallpapers'
import { getWidgetType } from '@/widgets/registry'
import { DesktopIcon } from './DesktopIcon'
import { WhatsAppShortcutIcon } from './WhatsAppShortcutIcon'
import { WhatsAppShortcutForm } from './WhatsAppShortcutForm'
import { FolderIcon } from './FolderIcon'
import { FolderCreateDialog } from './FolderCreateDialog'
import { FolderView } from './FolderView'
import { AppEditDialog } from './AppEditDialog'
import { useWhatsAppShortcuts } from '@/hooks/useWhatsAppShortcuts'
import { useFolders } from '@/hooks/useFolders'
import { WidgetGrid } from '@/widgets/WidgetGrid'
import { WidgetPicker } from '@/widgets/WidgetPicker'
import { DesktopContextMenu } from '@/widgets/DesktopContextMenu'
import { AppActionBar } from './AppActionBar'
import type { WidgetInstance } from '@/types/os'

const GRID_COLS = 24
const ROW_HEIGHT = 40
const RUBBER_BAND_THRESHOLD = 5

export function DesktopSurface() {
  const allApps = getAllApps()
  const pinnedAppIds = useDesktopApps((s) => s.pinnedAppIds)
  const apps = useMemo(
    () => allApps.filter((a) => pinnedAppIds.includes(a.appId)),
    [allApps, pinnedAppIds],
  )
  const wallpaper = useThemeStore((s) => s.wallpaper)
  const themeMode = useThemeStore((s) => s.mode)
  const wallpaperStyle = resolveWallpaper(wallpaper)

  // Resolve wallpaper tone for text contrast
  const rawTone = getWallpaperTone(wallpaper)
  const effectiveTone = useMemo(() => {
    if (rawTone !== 'auto') return rawTone
    // For 'auto' wallpapers (default, mesh, patterns), follow theme
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return themeMode === 'dark' ? 'dark' : 'light'
  }, [rawTone, themeMode])
  const placementActive = usePlacementMode((s) => s.active)
  const exitPlacement = usePlacementMode((s) => s.exit)
  const addWidget = useWidgetStore((s) => s.addWidget)
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)
  const selected = useDesktopSelection((s) => s.selected)
  const deselect = useDesktopSelection((s) => s.deselect)
  const selectMultiple = useDesktopSelection((s) => s.selectMultiple)
  const positions = useDesktopLayout((s) => s.positions)
  const ensurePositions = useDesktopLayout((s) => s.ensurePositions)
  const setPosition = useDesktopLayout((s) => s.setPosition)
  const setBounds = useDesktopLayout((s) => s.setBounds)

  const { shortcuts } = useWhatsAppShortcuts()
  const { folders } = useFolders()
  const topLevelFolders = useMemo(() => folders.filter((f) => !f.parent_id), [folders])

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [showWAForm, setShowWAForm] = useState(false)
  const [showFolderCreate, setShowFolderCreate] = useState(false)
  const [openFolderId, setOpenFolderId] = useState<string | null>(null)

  // Edit dialog state
  const [editTarget, setEditTarget] = useState<string | null>(null)

  // Draw-to-place state
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null)
  const drawStartRef = useRef<{ x: number; y: number } | null>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)

  // Multi-item drag state
  const [dragItems, setDragItems] = useState<string[] | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const dragOriginRef = useRef<{ col: number; row: number } | null>(null)

  // Rubber band selection state
  const rubberBandStartRef = useRef<{ x: number; y: number } | null>(null)
  const rubberBandActiveRef = useRef(false)
  const [rubberBandRect, setRubberBandRect] = useState<{
    left: number
    top: number
    width: number
    height: number
  } | null>(null)

  // Build list of all desktop item keys and ensure positions
  const allKeys = useMemo(() => {
    const keys: string[] = []
    for (const app of apps) keys.push(`app:${app.appId}`)
    for (const sc of shortcuts) keys.push(`shortcut:${sc.id}`)
    for (const f of topLevelFolders) keys.push(`folder:${f.id}`)
    return keys
  }, [apps, shortcuts, topLevelFolders])

  // Compute grid columns based on surface width
  const [surfaceSize, setSurfaceSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = surfaceRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        const h = entry.contentRect.height
        setSurfaceSize({ w, h })
        // Set bounds using full viewport dimensions (surface doesn't include topbar)
        setBounds(w, window.innerHeight)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [setBounds])

  const gridCols = Math.max(1, Math.floor(surfaceSize.w / ICON_CELL_W))

  useEffect(() => {
    if (allKeys.length > 0 && gridCols > 0) {
      ensurePositions(allKeys, gridCols)
    }
  }, [allKeys, gridCols, ensurePositions])

  // Position lookup map
  const positionMap = useMemo(() => {
    const map = new Map<string, { col: number; row: number }>()
    for (const p of positions) map.set(p.key, { col: p.col, row: p.row })
    return map
  }, [positions])

  // --- Parse item key ---
  const parseKey = useCallback(
    (key: string): { type: DesktopItemType; id: string } => {
      const colonIdx = key.indexOf(':')
      return {
        type: key.substring(0, colonIdx) as DesktopItemType,
        id: key.substring(colonIdx + 1),
      }
    },
    [],
  )

  // --- Context menu ---
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  // --- Icon drag start ---
  const handleIconDragStart = useCallback(
    (key: string, e: React.MouseEvent) => {
      if (placementActive) return
      const el = (e.target as HTMLElement).closest('[data-desktop-item]') as HTMLElement | null
      if (!el) return
      const rect = el.getBoundingClientRect()
      dragOffsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }

      const pos = positionMap.get(key)
      if (pos) dragOriginRef.current = { col: pos.col, row: pos.row }

      // Check if dragged item is in multi-selection
      const parsed = parseKey(key)
      const isInSelection = selected.some((s) => s.type === parsed.type && s.id === parsed.id)

      if (isInSelection && selected.length > 1) {
        setDragItems(selected.map((s) => `${s.type}:${s.id}`))
      } else {
        setDragItems([key])
      }
      setDragPos({ x: e.clientX, y: e.clientY })
    },
    [placementActive, positionMap, selected, parseKey],
  )

  // --- Mouse down ---
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || !surfaceRef.current) return

      if (usePlacementMode.getState().active) {
        // Widget draw-to-place
        const rect = surfaceRef.current.getBoundingClientRect()
        const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        drawStartRef.current = pos
        setDrawStart(pos)
        setDrawCurrent(pos)
        return
      }

      // Only start rubber band on truly empty desktop space
      const target = e.target as HTMLElement
      const isOnItem =
        target.closest('[data-desktop-item]') ||
        target.closest('[data-widget-frame]') ||
        target.closest('button')
      if (!isOnItem) {
        const rect = surfaceRef.current.getBoundingClientRect()
        rubberBandStartRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        rubberBandActiveRef.current = false
      }
    },
    [],
  )

  // --- Mouse move ---
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Icon drag
      if (dragItems) {
        setDragPos({ x: e.clientX, y: e.clientY })
        return
      }

      // Widget draw-to-place takes full priority
      if (drawStartRef.current && surfaceRef.current) {
        const rect = surfaceRef.current.getBoundingClientRect()
        setDrawCurrent({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        return
      }

      // Never rubber band during placement mode
      if (usePlacementMode.getState().active) return

      // Rubber band selection
      if (rubberBandStartRef.current && surfaceRef.current) {
        const rect = surfaceRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const start = rubberBandStartRef.current
        const dist = Math.hypot(x - start.x, y - start.y)

        if (dist > RUBBER_BAND_THRESHOLD) {
          rubberBandActiveRef.current = true
          const rbLeft = Math.min(start.x, x)
          const rbTop = Math.min(start.y, y)
          const rbRight = Math.max(start.x, x)
          const rbBottom = Math.max(start.y, y)

          setRubberBandRect({
            left: rbLeft,
            top: rbTop,
            width: rbRight - rbLeft,
            height: rbBottom - rbTop,
          })

          // Compute intersections
          const intersected: { type: DesktopItemType; id: string }[] = []
          for (const [key, pos] of positionMap) {
            const iconLeft = pos.col * ICON_CELL_W
            const iconTop = pos.row * ICON_CELL_H
            const iconRight = iconLeft + ICON_CELL_W
            const iconBottom = iconTop + ICON_CELL_H

            if (!(iconRight < rbLeft || iconLeft > rbRight || iconBottom < rbTop || iconTop > rbBottom)) {
              intersected.push(parseKey(key))
            }
          }
          selectMultiple(intersected)
        }
      }
    },
    [dragItems, positionMap, parseKey, selectMultiple],
  )

  // --- Mouse up ---
  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      // Multi-item drag drop
      if (dragItems && surfaceRef.current) {
        const rect = surfaceRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - dragOffsetRef.current.x + ICON_CELL_W / 2
        const y = e.clientY - rect.top - dragOffsetRef.current.y + ICON_CELL_H / 2
        const dropCol = Math.max(0, Math.floor(x / ICON_CELL_W))
        const dropRow = Math.max(0, Math.floor(y / ICON_CELL_H))

        if (dragItems.length === 1) {
          setPosition(dragItems[0], dropCol, dropRow)
        } else if (dragOriginRef.current) {
          const deltaCol = dropCol - dragOriginRef.current.col
          const deltaRow = dropRow - dragOriginRef.current.row
          for (const key of dragItems) {
            const pos = positionMap.get(key)
            if (pos) {
              setPosition(key, Math.max(0, pos.col + deltaCol), Math.max(0, pos.row + deltaRow))
            }
          }
        }
        setDragItems(null)
        setDragPos(null)
        return
      }

      // Widget draw-to-place — use refs to avoid stale closures
      const pm = usePlacementMode.getState()
      if (drawStartRef.current && surfaceRef.current && pm.widgetType) {
        const rect = surfaceRef.current.getBoundingClientRect()
        const colWidth = rect.width / GRID_COLS
        const dStart = drawStartRef.current
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const minX = Math.min(dStart.x, mouseX)
        const minY = Math.min(dStart.y, mouseY)
        const drawW = Math.abs(mouseX - dStart.x)
        const drawH = Math.abs(mouseY - dStart.y)
        const gridX = Math.round(minX / colWidth)
        const gridY = Math.round(minY / ROW_HEIGHT)

        const entry = getWidgetType(pm.widgetType)
        const defaultSize = entry?.defaultSize ?? { w: 4, h: 3 }
        const minSize = entry?.minSize ?? { w: 2, h: 2 }

        let gridW: number
        let gridH: number
        if (drawW > 30 && drawH > 30) {
          gridW = Math.max(minSize.w, Math.round(drawW / colWidth))
          gridH = Math.max(minSize.h, Math.round(drawH / ROW_HEIGHT))
        } else {
          gridW = defaultSize.w
          gridH = defaultSize.h
        }

        if (entry?.maxSize) {
          gridW = Math.min(gridW, entry.maxSize.w)
          gridH = Math.min(gridH, entry.maxSize.h)
        }

        const newWidget: WidgetInstance = {
          id: crypto.randomUUID(),
          type: pm.widgetType,
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
        exitPlacement()
        drawStartRef.current = null
        setDrawStart(null)
        setDrawCurrent(null)
        return
      }

      if (drawStartRef.current) {
        drawStartRef.current = null
        setDrawStart(null)
        setDrawCurrent(null)
        return
      }

      // Rubber band end — skip entirely during placement mode
      const pm2 = usePlacementMode.getState()
      if (pm2.active) return

      if (rubberBandStartRef.current) {
        if (!rubberBandActiveRef.current) {
          // Was just a click on empty space → deselect
          deselect()
        }
        rubberBandStartRef.current = null
        rubberBandActiveRef.current = false
        setRubberBandRect(null)
        return
      }
    },
    [
      dragItems,
      addWidget,
      exitPlacement,
      activeWorkspaceId,
      setPosition,
      positionMap,
      deselect,
    ],
  )

  // --- Keyboard ---
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (usePlacementMode.getState().active) {
          exitPlacement()
          drawStartRef.current = null
          setDrawStart(null)
          setDrawCurrent(null)
        }
        if (dragItems) {
          setDragItems(null)
          setDragPos(null)
        }
        deselect()
      }
      // Cmd+A / Ctrl+A → select all
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault()
        selectMultiple(allKeys.map((key) => parseKey(key)))
      }
    },
    [exitPlacement, dragItems, deselect, selectMultiple, allKeys, parseKey],
  )

  // --- Edit dialog helper ---
  const handleEdit = useCallback(
    (key: string) => {
      setEditTarget(key)
    },
    [],
  )

  // Compute edit dialog defaults
  const editDefaults = useMemo(() => {
    if (!editTarget) return null
    if (editTarget.startsWith('app:')) {
      const app = getApp(editTarget.slice(4))
      if (!app) return null
      return {
        key: editTarget,
        defaultName: app.title,
        defaultIconKey: getIconKey(app.icon),
      }
    }
    if (editTarget.startsWith('shortcut:')) {
      const sc = shortcuts.find((s) => s.id === editTarget.slice(9))
      if (!sc) return null
      return {
        key: editTarget,
        defaultName: sc.name,
        defaultColor: sc.color || '#25D366',
      }
    }
    if (editTarget.startsWith('folder:')) {
      const f = folders.find((fl) => fl.id === editTarget.slice(7))
      if (!f) return null
      return {
        key: editTarget,
        defaultName: f.name,
        defaultColor: f.color || undefined,
      }
    }
    return null
  }, [editTarget, apps, shortcuts, folders])

  // --- Draw overlay rect ---
  const drawRect =
    drawStart && drawCurrent
      ? {
          left: Math.min(drawStart.x, drawCurrent.x),
          top: Math.min(drawStart.y, drawCurrent.y),
          width: Math.abs(drawCurrent.x - drawStart.x),
          height: Math.abs(drawCurrent.y - drawStart.y),
        }
      : null

  // Check if an item is being dragged
  const isDragging = (key: string) => dragItems?.includes(key) ?? false

  // Render icon by key (for drag ghosts)
  const renderIconByKey = (key: string) => {
    if (key.startsWith('app:')) {
      const app = apps.find((a) => `app:${a.appId}` === key)
      return app ? <DesktopIcon app={app} /> : null
    }
    if (key.startsWith('shortcut:')) {
      const sc = shortcuts.find((s) => `shortcut:${s.id}` === key)
      return sc ? <WhatsAppShortcutIcon shortcut={sc} /> : null
    }
    if (key.startsWith('folder:')) {
      const f = topLevelFolders.find((fl) => `folder:${fl.id}` === key)
      return f ? <FolderIcon folder={f} onOpen={() => {}} /> : null
    }
    return null
  }

  return (
    <div
      ref={surfaceRef}
      className="fixed inset-0 overflow-hidden outline-none"
      data-wallpaper-tone={effectiveTone}
      style={{
        top: 'var(--topbar-height)',
        bottom: 0,
        zIndex: 0,
        background: wallpaperStyle.background,
        backgroundSize: wallpaperStyle.backgroundSize,
        cursor: placementActive ? 'crosshair' : undefined,
      }}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Desktop icons layer (z-10) — absolute positioned on grid */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 10, pointerEvents: placementActive ? 'none' : undefined, padding: 8 }}
      >
        {apps.map((app) => {
          const key = `app:${app.appId}`
          const pos = positionMap.get(key)
          if (!pos) return null
          const dragging = isDragging(key)
          return (
            <div
              key={key}
              data-desktop-item={key}
              className="absolute"
              style={{
                left: pos.col * ICON_CELL_W,
                top: pos.row * ICON_CELL_H,
                width: ICON_CELL_W,
                height: ICON_CELL_H,
                opacity: dragging ? 0.4 : 1,
                transition: dragging ? 'none' : 'left 0.2s, top 0.2s',
              }}
              onMouseDown={(e) => handleIconDragStart(key, e)}
            >
              <DesktopIcon app={app} onEdit={handleEdit} />
            </div>
          )
        })}

        {shortcuts.map((sc) => {
          const key = `shortcut:${sc.id}`
          const pos = positionMap.get(key)
          if (!pos) return null
          const dragging = isDragging(key)
          return (
            <div
              key={key}
              data-desktop-item={key}
              className="absolute"
              style={{
                left: pos.col * ICON_CELL_W,
                top: pos.row * ICON_CELL_H,
                width: ICON_CELL_W,
                height: ICON_CELL_H,
                opacity: dragging ? 0.4 : 1,
                transition: dragging ? 'none' : 'left 0.2s, top 0.2s',
              }}
              onMouseDown={(e) => handleIconDragStart(key, e)}
            >
              <WhatsAppShortcutIcon shortcut={sc} />
            </div>
          )
        })}

        {topLevelFolders.map((folder) => {
          const key = `folder:${folder.id}`
          const pos = positionMap.get(key)
          if (!pos) return null
          const dragging = isDragging(key)
          return (
            <div
              key={key}
              data-desktop-item={key}
              className="absolute"
              style={{
                left: pos.col * ICON_CELL_W,
                top: pos.row * ICON_CELL_H,
                width: ICON_CELL_W,
                height: ICON_CELL_H,
                opacity: dragging ? 0.4 : 1,
                transition: dragging ? 'none' : 'left 0.2s, top 0.2s',
              }}
              onMouseDown={(e) => handleIconDragStart(key, e)}
            >
              <FolderIcon folder={folder} onOpen={(id) => setOpenFolderId(id)} />
            </div>
          )
        })}

        {/* Multi-drag ghosts */}
        {dragItems &&
          dragPos &&
          surfaceRef.current &&
          dragOriginRef.current &&
          dragItems.map((key) => {
            const pos = positionMap.get(key)
            if (!pos) return null
            const origin = dragOriginRef.current!
            const offsetX = (pos.col - origin.col) * ICON_CELL_W
            const offsetY = (pos.row - origin.row) * ICON_CELL_H
            return (
              <div
                key={`ghost-${key}`}
                className="fixed pointer-events-none"
                style={{
                  left: dragPos.x - dragOffsetRef.current.x + offsetX,
                  top: dragPos.y - dragOffsetRef.current.y + offsetY,
                  width: ICON_CELL_W,
                  height: ICON_CELL_H,
                  zIndex: 50,
                  opacity: 0.85,
                }}
              >
                {renderIconByKey(key)}
              </div>
            )
          })}

        {/* Drop target indicator */}
        {dragItems &&
          dragPos &&
          surfaceRef.current &&
          (() => {
            const rect = surfaceRef.current!.getBoundingClientRect()
            const x = dragPos.x - rect.left - dragOffsetRef.current.x + ICON_CELL_W / 2
            const y = dragPos.y - rect.top - dragOffsetRef.current.y + ICON_CELL_H / 2
            const col = Math.max(0, Math.floor(x / ICON_CELL_W))
            const row = Math.max(0, Math.floor(y / ICON_CELL_H))
            return (
              <div
                className="absolute rounded-[var(--radius-md)] pointer-events-none"
                style={{
                  left: col * ICON_CELL_W + 8,
                  top: row * ICON_CELL_H + 8,
                  width: ICON_CELL_W - 16,
                  height: ICON_CELL_H - 16,
                  border: '2px dashed var(--color-accent)',
                  background: 'var(--color-accent-subtle)',
                  transition: 'left 0.1s, top 0.1s',
                }}
              />
            )
          })()}
      </div>

      {/* Widget grid layer (z-20) */}
      <div className="absolute inset-0" style={{ zIndex: 20, pointerEvents: 'none' }}>
        <WidgetGrid />
      </div>

      {/* Draw-to-place overlay (z-30) */}
      {placementActive && drawRect && drawRect.width > 5 && drawRect.height > 5 && (
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

      {/* Rubber band selection overlay (z-30) */}
      {rubberBandRect && rubberBandRect.width > 2 && rubberBandRect.height > 2 && (
        <div
          className="absolute pointer-events-none"
          style={{
            zIndex: 30,
            left: rubberBandRect.left,
            top: rubberBandRect.top,
            width: rubberBandRect.width,
            height: rubberBandRect.height,
            border: '1px solid var(--color-accent)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-accent-subtle)',
          }}
        />
      )}

      {/* Placement mode hint */}
      {placementActive && !drawStart && (
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
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
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
          onNewFolder={() => setShowFolderCreate(true)}
        />
      )}

      {/* Widget picker modal */}
      {showPicker && <WidgetPicker onClose={() => setShowPicker(false)} />}

      {/* WhatsApp shortcut form */}
      {showWAForm && <WhatsAppShortcutForm onClose={() => setShowWAForm(false)} />}

      {/* Folder creation dialog */}
      {showFolderCreate && <FolderCreateDialog onClose={() => setShowFolderCreate(false)} />}

      {/* Folder view overlay */}
      {openFolderId &&
        (() => {
          const openFolder = folders.find((f) => f.id === openFolderId)
          if (!openFolder) return null
          return (
            <FolderView
              folder={openFolder}
              onClose={() => setOpenFolderId(null)}
              onOpenSubfolder={(id) => setOpenFolderId(id)}
            />
          )
        })()}

      {/* App edit dialog */}
      {editDefaults && (
        <AppEditDialog
          itemKey={editDefaults.key}
          defaultName={editDefaults.defaultName}
          defaultIconKey={editDefaults.defaultIconKey}
          defaultColor={editDefaults.defaultColor}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* App action bar (appears when icon(s) selected) */}
      <AppActionBar onEdit={handleEdit} />
    </div>
  )
}
