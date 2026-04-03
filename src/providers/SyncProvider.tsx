import { createContext, useContext, type ReactNode } from 'react'
import { useSync } from '@/hooks/useSync'

interface SyncContextValue {
  isOnline: boolean
  isSyncing: boolean
  pendingCount: number
}

const SyncContext = createContext<SyncContextValue>({
  isOnline: true,
  isSyncing: false,
  pendingCount: 0,
})

export function useSyncStatus() {
  return useContext(SyncContext)
}

export function SyncProvider({ children }: { children: ReactNode }) {
  const syncState = useSync()

  return (
    <SyncContext.Provider value={syncState}>{children}</SyncContext.Provider>
  )
}
