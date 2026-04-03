import { useState, useEffect, useCallback } from 'react'
import { useWindowStore } from '@/stores/window-store'
import type { WidgetProps } from '@/types/os'

const STORAGE_PREFIX = 'tabletop-quicknote-'

export function QuickNoteWidget({ widgetId }: WidgetProps) {
  const openWindow = useWindowStore((s) => s.openWindow)
  const storageKey = `${STORAGE_PREFIX}${widgetId}`

  const [text, setText] = useState(() => {
    try {
      return localStorage.getItem(storageKey) ?? ''
    } catch {
      return ''
    }
  })

  const save = useCallback(
    (value: string) => {
      try {
        localStorage.setItem(storageKey, value)
      } catch {
        // localStorage full or unavailable
      }
    },
    [storageKey]
  )

  useEffect(() => {
    const timeout = setTimeout(() => save(text), 500)
    return () => clearTimeout(timeout)
  }, [text, save])

  return (
    <div className="flex flex-col h-full gap-1.5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a quick note..."
        className="flex-1 w-full resize-none text-[12px] p-1 rounded-[var(--radius-sm)] outline-none"
        style={{
          background: 'var(--color-bg-elevated)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-subtle)',
        }}
      />
      <button
        onClick={() => openWindow('notes')}
        className="text-[11px] font-medium py-0.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
        style={{ color: 'var(--color-accent)' }}
      >
        Open in Notes
      </button>
    </div>
  )
}
