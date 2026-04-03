import { Suspense } from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { WindowErrorBoundary } from './WindowErrorBoundary'
import type { OSWindow, AppRegistryEntry } from '@/types/os'

interface Props {
  window: OSWindow
  app: AppRegistryEntry
}

function WindowSkeleton() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export function WindowContent({ window: win, app }: Props) {
  const AppComponent = app.component

  return (
    <WindowErrorBoundary windowId={win.id}>
      <Suspense fallback={<WindowSkeleton />}>
        <MemoryRouter initialEntries={[win.initialRoute || '/']}>
          <div className="flex flex-col h-full min-h-0">
            <Routes>
              <Route path="/*" element={<AppComponent />} />
            </Routes>
          </div>
        </MemoryRouter>
      </Suspense>
    </WindowErrorBoundary>
  )
}
