import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WidgetInstance } from '@/types/os'

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

      enterPlacementMode: (widgetType) =>
        set({ placementMode: { active: true, widgetType } }),

      exitPlacementMode: () =>
        set({ placementMode: { active: false, widgetType: null } }),

      getWidgetsByWorkspace: (workspaceId) =>
        get().widgets.filter((w) => w.workspaceId === workspaceId && !w.hidden),
    }),
    { name: 'tabletop-widgets' }
  )
)
