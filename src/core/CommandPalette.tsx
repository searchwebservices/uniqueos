import { useEffect, useRef, useState, useMemo } from 'react'
import { Search, StickyNote, CheckSquare } from 'lucide-react'
import { useCommandPaletteStore } from '@/stores/command-palette-store'
import { useWindowStore } from '@/stores/window-store'
import { getAllApps } from '@/lib/app-registry'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/cn'

interface SearchResult {
  id: string
  type: 'app' | 'note' | 'task'
  title: string
  subtitle?: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  action: () => void
}

export function CommandPalette() {
  const { isOpen, query, close, setQuery } = useCommandPaletteStore()
  const openWindow = useWindowStore(s => s.openWindow)
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [noteResults, setNoteResults] = useState<SearchResult[]>([])
  const [taskResults, setTaskResults] = useState<SearchResult[]>([])
  const resultsRef = useRef<HTMLDivElement>(null)

  const apps = getAllApps()
  const filteredApps: SearchResult[] = useMemo(() => {
    const list = query.trim()
      ? apps.filter(a =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
        )
      : apps

    return list.map(app => ({
      id: `app-${app.appId}`,
      type: 'app' as const,
      title: app.title,
      subtitle: app.category,
      icon: app.icon,
      action: () => {
        openWindow(app.appId)
        close()
      },
    }))
  }, [query, apps, openWindow, close])

  // Search notes and tasks when query has 2+ characters
  useEffect(() => {
    if (!isOpen || query.trim().length < 2) {
      setNoteResults([])
      setTaskResults([])
      return
    }

    const search = async () => {
      const searchTerm = `%${query.trim()}%`

      // Search notes
      const { data: notes } = await supabase
        .from('notes')
        .select('id, title')
        .ilike('title', searchTerm)
        .limit(5)

      if (notes) {
        setNoteResults(
          notes.map((n: { id: string; title: string }) => ({
            id: `note-${n.id}`,
            type: 'note' as const,
            title: n.title || 'Untitled',
            subtitle: 'Note',
            icon: StickyNote,
            action: () => {
              openWindow('notes', { noteId: n.id })
              close()
            },
          }))
        )
      }

      // Search tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id, title, status')
        .ilike('title', searchTerm)
        .limit(5)

      if (tasks) {
        setTaskResults(
          tasks.map((t: { id: string; title: string; status: string }) => ({
            id: `task-${t.id}`,
            type: 'task' as const,
            title: t.title,
            subtitle: t.status,
            icon: CheckSquare,
            action: () => {
              openWindow('tasks')
              close()
            },
          }))
        )
      }
    }

    const timer = setTimeout(search, 200)
    return () => clearTimeout(timer)
  }, [query, isOpen, openWindow, close])

  // Build grouped results
  const allResults = useMemo(() => {
    const groups: { label: string; items: SearchResult[] }[] = []
    if (filteredApps.length > 0) groups.push({ label: 'Apps', items: filteredApps })
    if (noteResults.length > 0) groups.push({ label: 'Notes', items: noteResults })
    if (taskResults.length > 0) groups.push({ label: 'Tasks', items: taskResults })
    return groups
  }, [filteredApps, noteResults, taskResults])

  const flatResults = useMemo(
    () => allResults.flatMap(g => g.items),
    [allResults]
  )

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Scroll selected item into view
  useEffect(() => {
    if (!resultsRef.current) return
    const el = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    if (el) {
      el.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  if (!isOpen) return null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, flatResults.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
      return
    }
    if (e.key === 'Enter' && flatResults.length > 0) {
      flatResults[selectedIndex]?.action()
      return
    }
    if (e.key === 'Escape') {
      close()
    }
  }

  let globalIndex = -1

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-150"
        style={{ zIndex: 2000 }}
        onClick={close}
      />

      {/* Palette */}
      <div
        className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-lg)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        style={{ zIndex: 2001 }}
      >
        {/* Search input */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--color-border-subtle)]">
          <Search size={16} className="text-[var(--color-text-tertiary)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search apps, notes, tasks..."
            className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
          />
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-72 overflow-y-auto py-1">
          {flatResults.length === 0 ? (
            <p className="px-3 py-4 text-xs text-[var(--color-text-tertiary)] text-center">
              No results found
            </p>
          ) : (
            allResults.map(group => (
              <div key={group.label}>
                {/* Group label */}
                {allResults.length > 1 && (
                  <p className="px-3 pt-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    {group.label}
                  </p>
                )}
                {group.items.map(result => {
                  globalIndex++
                  const idx = globalIndex
                  const Icon = result.icon
                  return (
                    <button
                      key={result.id}
                      data-index={idx}
                      onClick={result.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'flex items-center gap-3 w-full px-3 py-2 text-left transition-colors',
                        idx === selectedIndex
                          ? 'bg-[var(--color-bg-tertiary)]'
                          : 'hover:bg-[var(--color-bg-tertiary)]'
                      )}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]">
                        <Icon size={16} className="text-[var(--color-text-primary)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-[var(--color-text-primary)] truncate">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-[10px] text-[var(--color-text-tertiary)] capitalize">{result.subtitle}</p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-3 py-1.5 border-t border-[var(--color-border-subtle)] text-[10px] text-[var(--color-text-tertiary)]">
          <span>Arrow keys to navigate</span>
          <span>Enter to select</span>
          <span>Esc to close</span>
        </div>
      </div>
    </>
  )
}
