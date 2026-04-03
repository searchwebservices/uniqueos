// Manual database types — will be replaced with generated types later

export interface DbRole {
  id: string
  name: string
  description: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface DbUserProfile {
  id: string
  display_name: string
  avatar_url: string | null
  role_id: string | null
  created_at: string
  updated_at: string
}

export interface DbUserSettings {
  id: string
  theme: 'light' | 'dark' | 'system'
  wallpaper: string
  accent_color: string
  dock_items: { appId: string; order: number }[]
  dock_position: string
  dock_auto_hide: boolean
  created_at: string
  updated_at: string
}

export interface DbUserWidget {
  id: string
  user_id: string
  widget_type: string
  workspace_id: string
  layout: { x: number; y: number; w: number; h: number }
  config: Record<string, unknown>
  hidden: boolean
  created_at: string
  updated_at: string
}

export interface DbUserLayout {
  id: string
  user_id: string
  workspace_id: string
  windows: { appId: string; meta?: Record<string, unknown> }[]
  created_at: string
  updated_at: string
}

export interface DbCalendarEvent {
  id: string
  user_id: string
  title: string
  description: string | null
  start_at: string
  end_at: string
  all_day: boolean
  color: string | null
  recurrence_rule: string | null
  google_event_id: string | null
  google_calendar_id: string | null
  created_at: string
  updated_at: string
}

export interface DbTask {
  id: string
  user_id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string | null
  tags: string[]
  sort_order: number
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface DbReminder {
  id: string
  user_id: string
  title: string
  notes: string | null
  remind_at: string
  repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface DbDriveItem {
  id: string
  user_id: string
  parent_id: string | null
  name: string
  type: 'file' | 'folder'
  mime_type: string | null
  size_bytes: number | null
  storage_path: string | null
  public_url: string | null
  is_published: boolean
  google_file_id: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface DbNote {
  id: string
  user_id: string
  title: string
  content: Record<string, unknown> | null
  plain_text: string | null
  pinned: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface DbVoiceMemo {
  id: string
  user_id: string
  title: string
  storage_path: string
  duration_seconds: number | null
  transcript: string | null
  transcript_status: 'pending' | 'processing' | 'done' | 'failed'
  created_at: string
  updated_at: string
}

export interface DbAiConversation {
  id: string
  user_id: string
  title: string
  model: string
  created_at: string
  updated_at: string
}

export interface DbAiMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface DbAiUsage {
  id: string
  user_id: string
  date: string
  message_count: number
}

export interface DbWhatsAppShortcut {
  id: string
  user_id: string
  name: string
  type: 'direct' | 'group'
  phone_number: string | null
  group_invite_code: string | null
  icon_url: string | null
  color: string
  position: { x: number; y: number } | null
  folder_id: string | null
  created_at: string
  updated_at: string
}

export interface DbRolePermission {
  id: string
  role_id: string
  app_id: string
  can_access: boolean
  created_at: string
}

// ── Desktop Folders ──

export type FolderIconPreset = 'folder' | 'whatsapp' | 'documents' | 'projects' | 'media' | 'contacts' | 'finance' | 'tools' | 'social' | 'custom'

export interface DbDesktopFolder {
  id: string
  user_id: string
  name: string
  parent_id: string | null
  icon_preset: FolderIconPreset
  color: string
  config: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type FolderItemType = 'app' | 'shortcut' | 'subfolder' | 'file' | 'link' | 'contact'

export interface DbDesktopFolderItem {
  id: string
  folder_id: string
  item_type: FolderItemType
  item_id: string
  label: string | null
  sort_order: number
  config: Record<string, unknown>
  created_at: string
}

// ── Contacts ──

export type ContactRelationship = 'friend' | 'family' | 'coworker' | 'client' | 'partner' | 'vendor' | 'other'

export interface DbContact {
  id: string
  user_id: string
  name: string
  nickname: string | null
  email: string | null
  phone: string | null
  avatar_url: string | null
  tags: string[]
  relationship: ContactRelationship
  company: string | null
  job_title: string | null
  socials: {
    whatsapp?: string
    instagram?: string
    linkedin?: string
    twitter?: string
    facebook?: string
    github?: string
    website?: string
    [key: string]: string | undefined
  }
  address: string | null
  notes: string | null
  favorite: boolean
  created_at: string
  updated_at: string
}

export interface DbContactFile {
  id: string
  contact_id: string
  drive_item_id: string | null
  file_url: string | null
  file_name: string
  file_type: string | null
  created_at: string
}
