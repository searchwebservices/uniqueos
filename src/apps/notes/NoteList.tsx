import type { DbNote } from '@/types/database'
import { NoteListItem } from './NoteListItem'

interface NoteListProps {
  notes: DbNote[]
  activeNoteId: string | null
  onSelectNote: (note: DbNote) => void
}

export function NoteList({ notes, activeNoteId, onSelectNote }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full px-4">
        <p
          className="text-[11px] text-center"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          No notes yet
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-auto h-full">
      {notes.map((note) => (
        <NoteListItem
          key={note.id}
          note={note}
          active={note.id === activeNoteId}
          onClick={() => onSelectNote(note)}
        />
      ))}
    </div>
  )
}
