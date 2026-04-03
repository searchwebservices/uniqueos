import { memo } from 'react'
import { useWindowStore } from '@/stores/window-store'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { WindowFrame } from './WindowFrame'
import type { OSWindow } from '@/types/os'

// Memoize individual window frames to prevent re-render cascades on focus changes
const MemoizedWindowFrame = memo(WindowFrame, (prev, next) => {
  const pw = prev.window
  const nw = next.window
  return (
    pw.id === nw.id &&
    pw.state === nw.state &&
    pw.zIndex === nw.zIndex &&
    pw.position.x === nw.position.x &&
    pw.position.y === nw.position.y &&
    pw.size.width === nw.size.width &&
    pw.size.height === nw.size.height &&
    pw.title === nw.title
  )
})

function WindowManagerInner({ visibleWindows }: { visibleWindows: OSWindow[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 100, top: 'var(--topbar-height)', bottom: 'var(--dock-height)' }}>
      {visibleWindows.map(win => (
        <MemoizedWindowFrame key={win.id} window={win} />
      ))}
    </div>
  )
}

export function WindowManager() {
  const windows = useWindowStore(s => s.windows)
  const activeWorkspaceId = useWorkspaceStore(s => s.activeWorkspaceId)

  const visibleWindows = windows.filter(
    w => w.workspaceId === activeWorkspaceId && w.state !== 'minimized'
  )

  return <WindowManagerInner visibleWindows={visibleWindows} />
}
