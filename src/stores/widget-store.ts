import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WidgetInstance } from '@/types/os'

// ── Placement mode: separate non-persisted store ──
interface PlacementModeStore {
  active: boolean
  widgetType: string | null
  enter: (widgetType: string) => void
  exit: () => void
}

export const usePlacementMode = create<PlacementModeStore>()((set) => ({
  active: false,
  widgetType: null,
  enter: (widgetType) => set({ active: true, widgetType }),
  exit: () => set({ active: false, widgetType: null }),
}))

// ── Widget data: persisted store ──
interface WidgetStore {
  widgets: WidgetInstance[]
  placementMode: { active: boolean; widgetType: string | null }

  addWidget: (widget: WidgetInstance) => void
  removeWidget: (widgetId: string) => void
  moveWidget: (widgetId: string, layout: { x: number; y: number; w: number; h: number }) => void
  updateLayout: (widgetId: string, layout: Partial<WidgetInstance['layout']>) => void
  updateConfig: (widgetId: string, config: Record<string, unknown>) => void
  enterPlacementMode: (widgetType: string) => void
  exitPlacementMode: () => void
  getWidgetsByWorkspace: (workspaceId: string) => WidgetInstance[]
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set, get) => ({
      widgets: [],
      placementMode: { active: false, widgetType: null },

      addWidget: (widget) =>
        set((state) => ({
          widgets: [...state.widgets, widget],
        })),

      removeWidget: (widgetId) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== widgetId),
        })),

      moveWidget: (widgetId, layout) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === widgetId ? { ...w, layout } : w
          ),
        })),

      updateLayout: (widgetId, layout) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === widgetId ? { ...w, layout: { ...w.layout, ...layout } } : w
          ),
        })),

      updateConfig: (widgetId, config) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === widgetId ? { ...w, config: { ...w.config, ...config } } : w
          ),
        })),

      // These now delegate to the separate placement store
      enterPlacementMode: (widgetType) => {
        usePlacementMode.getState().enter(widgetType)
      },

      exitPlacementMode: () => {
        usePlacementMode.getState().exit()
      },

      getWidgetsByWorkspace: (workspaceId) =>
        get().widgets.filter((w) => w.workspaceId === workspaceId && !w.hidden),
    }),
    {
      name: 'tabletop-widgets',
      version: 1,
      partialize: (state) => ({
        widgets: state.widgets,
      }) as unknown as WidgetStore,
      migrate: (persisted: unknown, version: number) => {
        if (version === 0) {
          const state = persisted as { widgets?: WidgetInstance[] }
          const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          if (state.widgets) {
            state.widgets = state.widgets.map(w =>
              UUID_RE.test(w.id) ? w : { ...w, id: crypto.randomUUID() }
            )
          }
        }
        return persisted as WidgetStore
      },
    }
  )
)
