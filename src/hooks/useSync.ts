import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function useSync() {
  const isOnline = useOnlineStatus()
  return { isOnline, isSyncing: false, pendingCount: 0 }
}
