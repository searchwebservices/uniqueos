import { useState, useCallback, useEffect } from 'react'
import { Plus, Search, Pin, PinOff, Trash2 } from 'lucide-react'
import type { DbNote } from '@/types/database'
import { useNotes } from './hooks'
import { NoteList } from './NoteList'
import { NoteEditor } from './NoteEditor'

interface NotesAppProps {
  initialNoteId?: string
}

export function NotesApp({ initialNoteId }: NotesAppProps) {
  const [search, setSearch] = useState('')
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    initialNoteId ?? null,
  )

  const { notes, isLoading, createNote, updateNote, togglePin, deleteNote } =
    useNotes({ search: search || undefined })

  const activeNote = notes.find((n) => n.id === activeNoteId) ?? null

  // Select first note if none active
  useEffect(() => {
    if (!activeNoteId && notes.length > 0 && !initialNoteId) {
      setActiveNoteId(notes[0].id)
    }
  }, [notes, activeNoteId, initialNoteId])

  const handleCreateNote = useCallback(() => {
    createNote.mutate(undefined, {
      onSuccess: (note) => {
        setActiveNoteId(note.id)
      },
    })
  }, [createNote])

  const handleSelectNote = useCallback((note: DbNote) => {
    setActiveNoteId(note.id)
  }, [])

  const handleUpdateNote = useCallback(
    (data: {
      title: string
      content: Record<string, unknown>
      plain_text: string
    }) => {
      if (!activeNoteId) return
      updateNote.mutate({
        id: activeNoteId,
        ...data,
      })
    },
    [activeNoteId, updateNote],
  )

  const handleTogglePin = useCallback(() => {
    if (!activeNote) return
    togglePin.mutate({ id: activeNote.id, pinned: !activeNote.pinned })
  }, [activeNote, togglePin])

  const handleDelete = useCallback(() => {
    if (!activeNote) return
    const idx = notes.findIndex((n) => n.id === activeNote.id)
    deleteNote.mutate(activeNote.id)
    // Select next note
    const next = notes[idx + 1] ?? notes[idx - 1]
    setActiveNoteId(next?.id ?? null)
  }, [activeNote, notes, deleteNote])

  return (
    <div className="flex h-full bg-[var(--color-bg-elevated)]">
      {/* Sidebar */}
      <div
        className="w-[220px] shrink-0 flex flex-col border-r"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        {/* Sidebar header */}
        <div
          className="flex items-center gap-1.5 px-3 py-2 border-b shrink-0"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div
            className="flex-1 flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-md)] border"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-bg-secondary)',
            }}
          >
            <Search
              size={11}
              style={{ color: 'var(--color-text-tertiary)' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 text-[11px] bg-transparent outline-none"
              style={{ color: 'var(--color-text-primary)' }}
            />
          </div>
          <button
            onClick={handleCreateNote}
            className="p-1.5 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
            style={{ color: 'var(--color-accent)' }}
            title="New note"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Note list */}
        <div className="flex-1 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-[11px] text-[var(--color-text-tertiary)]">
                Loading...
              </span>
            </div>
          ) : (
            <NoteList
              notes={notes}
              activeNoteId={activeNoteId}
              onSelectNote={handleSelectNote}
            />
          )}
        </div>
      </div>

      {/* Main editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeNote ? (
          <>
            {/* Note toolbar */}
            <div
              className="flex items-center justify-end gap-1 px-3 py-1.5 border-b shrink-0"
              style={{ borderColor: 'var(--color-border-subtle)' }}
            >
              <button
                onClick={handleTogglePin}
                className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                style={{
                  color: activeNote.pinned
                    ? 'var(--color-accent)'
                    : 'var(--color-text-tertiary)',
                }}
                title={activeNote.pinned ? 'Unpin' : 'Pin'}
              >
                {activeNote.pinned ? <PinOff size={13} /> : <Pin size={13} />}
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                style={{ color: 'var(--color-text-tertiary)' }}
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div className="flex-1 min-h-0">
              <NoteEditor
                key={activeNote.id}
                note={activeNote}
                onUpdate={handleUpdateNote}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-sm text-[var(--color-text-tertiary)]">
              {notes.length === 0
                ? 'Create your first note'
                : 'Select a note'}
            </p>
            {notes.length === 0 && (
              <button
                onClick={handleCreateNote}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)]"
                style={{ background: 'var(--color-accent)' }}
              >
                <Plus size={12} />
                New note
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
