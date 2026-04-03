import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const ICON_CELL_W = 80
export const ICON_CELL_H = 90

/** Dock height in px — icons can't overlap this zone */
const DOCK_RESERVED_H = 64
/** Top bar height in px */
const TOPBAR_H = 36

export interface DesktopItemPosition {
  /** Unique key: 'app:calendar', 'shortcut:uuid', 'folder:uuid' */
  key: string
  col: number
  row: number
}

interface DesktopLayoutStore {
  positions: DesktopItemPosition[]
  /** Current device ID for Supabase sync */
  deviceId: string | null
  /** Screen bounds (set by DesktopSurface) */
  maxCols: number
  maxRows: number

  setDeviceId: (id: string) => void
  setBounds: (screenWidth: number, screenHeight: number) => void
  getPosition: (key: string) => DesktopItemPosition | undefined
  setPosition: (key: string, col: number, row: number) => void
  removePosition: (key: string) => void
  /** Replace all positions (used on DB pull) */
  loadPositions: (positions: DesktopItemPosition[]) => void
  /** Auto-layout: assign grid positions to any items that don't have one yet */
  ensurePositions: (keys: string[], gridCols: number) => void
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

export const useDesktopLayout = create<DesktopLayoutStore>()(
  persist(
    (set, get) => ({
      positions: [],
      deviceId: null,
      maxCols: 20,
      maxRows: 8,

      setDeviceId: (id) => set({ deviceId: id }),

      setBounds: (screenWidth, screenHeight) => {
        const usableHeight = screenHeight - TOPBAR_H - DOCK_RESERVED_H
        const maxCols = Math.max(1, Math.floor(screenWidth / ICON_CELL_W))
        const maxRows = Math.max(1, Math.floor(usableHeight / ICON_CELL_H))
        set({ maxCols, maxRows })

        // Clamp any out-of-bounds positions
        set((state) => {
          let changed = false
          const positions = state.positions.map((p) => {
            const cCol = clamp(p.col, 0, maxCols - 1)
            const cRow = clamp(p.row, 0, maxRows - 1)
            if (cCol !== p.col || cRow !== p.row) {
              changed = true
              return { ...p, col: cCol, row: cRow }
            }
            return p
          })
          return changed ? { positions } : state
        })
      },

      getPosition: (key) => get().positions.find((p) => p.key === key),

      setPosition: (key, col, row) =>
        set((state) => {
          const cCol = clamp(col, 0, state.maxCols - 1)
          const cRow = clamp(row, 0, state.maxRows - 1)
          const existing = state.positions.findIndex((p) => p.key === key)
          if (existing >= 0) {
            const positions = [...state.positions]
            positions[existing] = { key, col: cCol, row: cRow }
            return { positions }
          }
          return { positions: [...state.positions, { key, col: cCol, row: cRow }] }
        }),

      removePosition: (key) =>
        set((state) => ({
          positions: state.positions.filter((p) => p.key !== key),
        })),

      loadPositions: (positions) => set({ positions }),

      ensurePositions: (keys, _gridCols) =>
        set((state) => {
          const existingKeys = new Set(state.positions.map((p) => p.key))
          const newKeys = keys.filter((k) => !existingKeys.has(k))
          if (newKeys.length === 0) return state

          const { maxCols, maxRows } = state

          // Find occupied cells
          const occupied = new Set(state.positions.map((p) => `${p.col},${p.row}`))

          const newPositions: DesktopItemPosition[] = []
          let col = 0
          let row = 0

          for (const key of newKeys) {
            // Find next free cell (column-first, like macOS)
            while (occupied.has(`${col},${row}`)) {
              row++
              if (row >= maxRows) {
                row = 0
                col++
                if (col >= maxCols) {
                  // Screen is full — stack at last cell
                  col = maxCols - 1
                  row = maxRows - 1
                  break
                }
              }
            }
            newPositions.push({ key, col, row })
            occupied.add(`${col},${row}`)
            row++
            if (row >= maxRows) {
              row = 0
              col++
            }
          }

          return { positions: [...state.positions, ...newPositions] }
        }),
    }),
    { name: 'tabletop-desktop-layout' },
  ),
)
