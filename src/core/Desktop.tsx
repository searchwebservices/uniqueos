import { TopBar } from './TopBar'
import { DesktopSurface } from './DesktopSurface'
import { Dock } from './Dock'
import { CommandPalette } from './CommandPalette'
import { SnapOverlay } from './SnapOverlay'
import { WindowManager } from '@/windows/WindowManager'
import { useKeyboard } from '@/hooks/useKeyboard'
import { usePersistence } from '@/hooks/usePersistence'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'
import { Toaster } from 'sonner'

export function Desktop() {
  useKeyboard()
  usePersistence()
  useRealtimeSync()

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--color-bg-primary)]">
      <TopBar />
      <DesktopSurface />
      <WindowManager />
      <SnapOverlay />
      <Dock />
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
