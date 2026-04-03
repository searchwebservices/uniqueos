import { NotesApp } from './NotesApp'

export default function NotesAppEntry() {
  // The noteId can be passed via window meta for multi-window support
  // This is handled by the window system passing meta.noteId
  return <NotesApp />
}
