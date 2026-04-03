import type { WidgetRegistryEntry } from '@/types/os'
import { ClockWidget } from './widgets/ClockWidget'
import { CalendarWidget } from './widgets/CalendarWidget'
import { TasksWidget } from './widgets/TasksWidget'
import { RemindersWidget } from './widgets/RemindersWidget'
import { WeatherWidget } from './widgets/WeatherWidget'
import { QuickNoteWidget } from './widgets/QuickNoteWidget'
import { SystemStatsWidget } from './widgets/SystemStatsWidget'

const widgetRegistry: WidgetRegistryEntry[] = [
  {
    type: 'clock',
    title: 'Clock',
    component: ClockWidget,
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 3, h: 2 },
    maxSize: { w: 8, h: 5 },
    associatedApp: undefined,
  },
  {
    type: 'calendar-mini',
    title: 'Calendar',
    component: CalendarWidget,
    defaultSize: { w: 5, h: 6 },
    minSize: { w: 4, h: 5 },
    maxSize: { w: 8, h: 8 },
    associatedApp: 'calendar',
  },
  {
    type: 'tasks-mini',
    title: 'Tasks',
    component: TasksWidget,
    defaultSize: { w: 5, h: 6 },
    minSize: { w: 4, h: 4 },
    maxSize: { w: 8, h: 10 },
    associatedApp: 'tasks',
  },
  {
    type: 'reminders-mini',
    title: 'Reminders',
    component: RemindersWidget,
    defaultSize: { w: 5, h: 5 },
    minSize: { w: 4, h: 3 },
    maxSize: { w: 8, h: 8 },
    associatedApp: 'reminders',
  },
  {
    type: 'weather',
    title: 'Weather',
    component: WeatherWidget,
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 3, h: 2 },
    maxSize: { w: 6, h: 5 },
    configSchema: {
      city: { type: 'string', label: 'City name', default: 'San Diego' },
    },
  },
  {
    type: 'quick-note',
    title: 'Quick note',
    component: QuickNoteWidget,
    defaultSize: { w: 5, h: 4 },
    minSize: { w: 3, h: 3 },
    maxSize: { w: 10, h: 8 },
    associatedApp: 'notes',
  },
  {
    type: 'system-stats',
    title: 'System stats',
    component: SystemStatsWidget,
    defaultSize: { w: 5, h: 3 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 8, h: 5 },
  },
]

const registryMap = new Map(widgetRegistry.map((w) => [w.type, w]))

export function getWidgetType(type: string): WidgetRegistryEntry | undefined {
  return registryMap.get(type)
}

export function getAllWidgetTypes(): WidgetRegistryEntry[] {
  return widgetRegistry
}
