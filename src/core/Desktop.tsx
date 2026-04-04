import { DesktopSurface } from './DesktopSurface'
import { Dock } from './Dock'
import { HomeMenu } from './HomeMenu'
import { MyAppsLauncher } from './MyAppsLauncher'
import { CommandPalette } from './CommandPalette'
import { SnapOverlay } from './SnapOverlay'
import { WindowManager } from '@/windows/WindowManager'
import { useKeyboard } from '@/hooks/useKeyboard'
import { usePersistence } from '@/hooks/usePersistence'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'
import { useDevice } from '@/hooks/useDevice'
import { useDesktopPersistence } from '@/hooks/useDesktopPersistence'
import { Toaster } from 'sonner'

export function Desktop() {
  useKeyboard()
  usePersistence()
  useRealtimeSync()
  const { currentDevice } = useDevice()
  useDesktopPersistence(currentDevice)

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--color-bg-primary)]">
      <DesktopSurface />
      <WindowManager />
      <SnapOverlay />
      <HomeMenu />
      <Dock />
      <MyAppsLauncher />
      <CommandPalette />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
          },
        }}
        offset={{ bottom: 80 }}
      />
    </div>
  )
}
