import Dexie, { type EntityTable } from 'dexie'
import type {
  DbCalendarEvent,
  DbTask,
  DbReminder,
  DbNote,
} from '@/types/database'

export interface SyncQueueItem {
  id?: number
  table: string
  operation: 'insert' | 'update' | 'delete'
  record_id: string
  payload: Record<string, unknown>
  created_at: string
}

class TabletopDB extends Dexie {
  calendar_events!: EntityTable<DbCalendarEvent, 'id'>
  tasks!: EntityTable<DbTask, 'id'>
  reminders!: EntityTable<DbReminder, 'id'>
  notes!: EntityTable<DbNote, 'id'>
  sync_queue!: EntityTable<SyncQueueItem, 'id'>

  constructor() {
    super('TabletopOS')

    this.version(1).stores({
      calendar_events: 'id, user_id, start_at, end_at, updated_at',
      tasks: 'id, user_id, status, priority, due_date, sort_order, updated_at',
      reminders: 'id, user_id, remind_at, completed, updated_at',
      notes: 'id, user_id, pinned, sort_order, updated_at',
      sync_queue: '++id, table, operation, record_id, created_at',
    })
  }
}

export const offlineDb = new TabletopDB()
