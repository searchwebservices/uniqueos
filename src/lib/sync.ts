import { supabase } from '@/lib/supabase'
import { offlineDb, type SyncQueueItem } from '@/lib/offline-db'
import type {
  DbCalendarEvent,
  DbTask,
  DbReminder,
  DbNote,
} from '@/types/database'

type SyncTable = 'calendar_events' | 'tasks' | 'reminders' | 'notes'

const TABLE_CONFIG: Record<SyncTable, { orderBy: string }> = {
  calendar_events: { orderBy: 'updated_at' },
  tasks: { orderBy: 'updated_at' },
  reminders: { orderBy: 'updated_at' },
  notes: { orderBy: 'updated_at' },
}

/**
 * Pull all rows for a user from Supabase and upsert into IndexedDB cache.
 */
export async function pullFromSupabase(userId: string): Promise<void> {
  const tables = Object.keys(TABLE_CONFIG) as SyncTable[]

  await Promise.all(
    tables.map(async (table) => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', userId)

      if (error || !data) return

      const dexieTable = offlineDb.table(table)
      await dexieTable.bulkPut(data)
    }),
  )
}

/**
 * Process the sync queue — push pending offline mutations to Supabase.
 * Conflict resolution: last-write-wins using updated_at.
 */
export async function processSyncQueue(): Promise<{
  processed: number
  failed: number
}> {
  const items = await offlineDb.sync_queue.toArray()
  let processed = 0
  let failed = 0

  for (const item of items) {
    const success = await processSyncItem(item)
    if (success) {
      await offlineDb.sync_queue.delete(item.id!)
      processed++
    } else {
      failed++
    }
  }

  return { processed, failed }
}

async function processSyncItem(item: SyncQueueItem): Promise<boolean> {
  try {
    switch (item.operation) {
      case 'insert': {
        const { error } = await supabase
          .from(item.table)
          .upsert(item.payload as Record<string, unknown>)
        return !error
      }
      case 'update': {
        const { error } = await supabase
          .from(item.table)
          .update(item.payload as Record<string, unknown>)
          .eq('id', item.record_id)
        return !error
      }
      case 'delete': {
        const { error } = await supabase
          .from(item.table)
          .delete()
          .eq('id', item.record_id)
        return !error
      }
      default:
        return false
    }
  } catch {
    return false
  }
}

/**
 * Write a mutation both to Supabase (if online) and IndexedDB.
 * If offline, queue the mutation for later sync.
 */
export async function syncWrite<
  T extends DbCalendarEvent | DbTask | DbReminder | DbNote,
>(
  table: SyncTable,
  operation: 'insert' | 'update' | 'delete',
  recordId: string,
  payload: Partial<T>,
  isOnline: boolean,
): Promise<void> {
  const dexieTable = offlineDb.table(table)

  if (operation === 'delete') {
    await dexieTable.delete(recordId)
  } else {
    await dexieTable.put(payload as T)
  }

  if (isOnline) {
    switch (operation) {
      case 'insert':
        await supabase.from(table).upsert(payload as Record<string, unknown>)
        break
      case 'update':
        await supabase
          .from(table)
          .update(payload as Record<string, unknown>)
          .eq('id', recordId)
        break
      case 'delete':
        await supabase.from(table).delete().eq('id', recordId)
        break
    }
  } else {
    await offlineDb.sync_queue.add({
      table,
      operation,
      record_id: recordId,
      payload: payload as Record<string, unknown>,
      created_at: new Date().toISOString(),
    })
  }
}

/**
 * Get the count of items pending sync.
 */
export async function getSyncQueueCount(): Promise<number> {
  return offlineDb.sync_queue.count()
}
