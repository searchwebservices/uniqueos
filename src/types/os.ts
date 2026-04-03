import type { ComponentType, LazyExoticComponent } from 'react'
import type { LucideIcon } from 'lucide-react'

// ── Window System ──

export type WindowState = 'normal' | 'minimized' | 'maximized' | 'snapped-left' | 'snapped-right'

export interface OSWindow {
  id: string
  appId: string
  title: string
  state: WindowState
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  restoreRect?: { x: number; y: number; width: number; height: number }
  workspaceId: string
  initialRoute?: string
  meta?: Record<string, unknown>
}

// ── App Registry ──

export interface AppRoute {
  path: string
  loader: () => Promise<{ default: ComponentType }>
}

export type AppCategory = 'productivity' | 'creative' | 'utility' | 'system'

export interface AppRegistryEntry {
  appId: string
  title: string
  icon: LucideIcon
  category: AppCategory
  component: LazyExoticComponent<ComponentType>
  defaultSize: { width: number; height: number }
  minSize: { width: number; height: number }
  singleton: boolean
  dockDefault: boolean
  dockOrder?: number
  routes: AppRoute[]
  buildRoute: (meta?: Record<string, unknown>) => string
  widgets?: string[]
  allowedRoles?: string[]
}

// ── Widget System ──

export interface WidgetProps {
  widgetId: string
  config?: Record<string, unknown>
}

export interface WidgetRegistryEntry {
  type: string
  title: string
  component: ComponentType<WidgetProps>
  defaultSize: { w: number; h: number }
  minSize: { w: number; h: number }
  maxSize?: { w: number; h: number }
  configSchema?: Record<string, unknown>
  associatedApp?: string
}

export interface WidgetInstance {
  id: string
  type: string
  workspaceId: string
  layout: { x: number; y: number; w: number; h: number }
  config: Record<string, unknown>
  hidden: boolean
}

// ── Workspace ──

export interface Workspace {
  id: string
  name: string
  order: number
}

// ── Dock ──

export interface DockItem {
  appId: string
  order: number
}

// ── Notifications ──

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  timestamp: number
  read: boolean
  appId?: string
  meta?: Record<string, unknown>
}

// ── Theme ──

export type ThemeMode = 'light' | 'dark' | 'system'
