import { lazy } from 'react'
import {
  Heart,
  Clock,
  Package,
  FileText,
  ClipboardList,
  Calendar,
  CheckSquare,
  Bell,
  StickyNote,
  Settings,
} from 'lucide-react'
import type { AppRegistryEntry } from '@/types/os'

const apps: AppRegistryEntry[] = [
  // ===== UCW CORE APPS =====
  {
    appId: 'couples',
    title: 'Parejas',
    icon: Heart,
    category: 'productivity',
    component: lazy(() => import('@/apps/couples')),
    defaultSize: { width: 520, height: 600 },
    minSize: { width: 380, height: 400 },
    singleton: true,
    dockDefault: true,
    dockOrder: 0,
    routes: [{ path: '/*', loader: () => import('@/apps/couples') }],
    buildRoute: () => '/',
  },
  {
    appId: 'wedding-timeline',
    title: 'Timeline',
    icon: Clock,
    category: 'productivity',
    component: lazy(() => import('@/apps/wedding-timeline')),
    defaultSize: { width: 600, height: 650 },
    minSize: { width: 400, height: 400 },
    singleton: false,
    dockDefault: true,
    dockOrder: 1,
    routes: [{ path: '/*', loader: () => import('@/apps/wedding-timeline') }],
    buildRoute: () => '/',
  },
  {
    appId: 'inventory',
    title: 'Inventario',
    icon: Package,
    category: 'productivity',
    component: lazy(() => import('@/apps/inventory')),
    defaultSize: { width: 700, height: 550 },
    minSize: { width: 400, height: 350 },
    singleton: true,
    dockDefault: true,
    dockOrder: 2,
    routes: [{ path: '/*', loader: () => import('@/apps/inventory') }],
    buildRoute: () => '/',
  },
  {
    appId: 'quotes',
    title: 'Cotizaciones',
    icon: FileText,
    category: 'productivity',
    component: lazy(() => import('@/apps/quotes')),
    defaultSize: { width: 650, height: 600 },
    minSize: { width: 400, height: 400 },
    singleton: false,
    dockDefault: true,
    dockOrder: 3,
    routes: [{ path: '/*', loader: () => import('@/apps/quotes') }],
    buildRoute: () => '/',
  },
  {
    appId: 'discovery',
    title: 'Discovery',
    icon: ClipboardList,
    category: 'utility',
    component: lazy(() => import('@/apps/discovery')),
    defaultSize: { width: 800, height: 650 },
    minSize: { width: 500, height: 400 },
    singleton: true,
    dockDefault: true,
    dockOrder: 4,
    routes: [{ path: '/*', loader: () => import('@/apps/discovery') }],
    buildRoute: () => '/',
  },

  // ===== UTILITY APPS (kept from original) =====
  {
    appId: 'calendar',
    title: 'Calendar',
    icon: Calendar,
    category: 'productivity',
    component: lazy(() => import('@/apps/calendar')),
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 400, height: 300 },
    singleton: true,
    dockDefault: false,
    routes: [{ path: '/*', loader: () => import('@/apps/calendar') }],
    buildRoute: () => '/',
  },
  {
    appId: 'tasks',
    title: 'Tasks',
    icon: CheckSquare,
    category: 'productivity',
    component: lazy(() => import('@/apps/tasks')),
    defaultSize: { width: 700, height: 550 },
    minSize: { width: 350, height: 300 },
    singleton: true,
    dockDefault: false,
    routes: [{ path: '/*', loader: () => import('@/apps/tasks') }],
    buildRoute: () => '/',
  },
  {
    appId: 'reminders',
    title: 'Reminders',
    icon: Bell,
    category: 'productivity',
    component: lazy(() => import('@/apps/reminders')),
    defaultSize: { width: 400, height: 500 },
    minSize: { width: 300, height: 300 },
    singleton: true,
    dockDefault: false,
    routes: [{ path: '/*', loader: () => import('@/apps/reminders') }],
    buildRoute: () => '/',
  },
  {
    appId: 'notes',
    title: 'Notes',
    icon: StickyNote,
    category: 'productivity',
    component: lazy(() => import('@/apps/notes')),
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 400, height: 300 },
    singleton: false,
    dockDefault: false,
    routes: [{ path: '/*', loader: () => import('@/apps/notes') }],
    buildRoute: (meta) => meta?.noteId ? `/note/${meta.noteId}` : '/',
  },
  {
    appId: 'settings',
    title: 'Settings',
    icon: Settings,
    category: 'system',
    component: lazy(() => import('@/apps/settings')),
    defaultSize: { width: 650, height: 500 },
    minSize: { width: 400, height: 350 },
    singleton: true,
    dockDefault: false,
    routes: [{ path: '/*', loader: () => import('@/apps/settings') }],
    buildRoute: () => '/',
  },
]

const appMap = new Map(apps.map(a => [a.appId, a]))

export function getApp(appId: string): AppRegistryEntry | undefined {
  return appMap.get(appId)
}

export function getAllApps(): AppRegistryEntry[] {
  return apps
}

export function getAccessibleApps(userRole?: string): AppRegistryEntry[] {
  return apps.filter(app =>
    !app.allowedRoles || !userRole || app.allowedRoles.includes(userRole)
  )
}

export function getDockDefaultApps(): AppRegistryEntry[] {
  return apps
    .filter(a => a.dockDefault)
    .sort((a, b) => (a.dockOrder ?? 99) - (b.dockOrder ?? 99))
}
