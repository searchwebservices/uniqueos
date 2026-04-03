import { useEffect, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useDebouncedCallback } from 'use-debounce'
import type { DbNote } from '@/types/database'
import { EditorToolbar } from './EditorToolbar'

interface NoteEditorProps {
  note: DbNote
  onUpdate: (data: {
    title: string
    content: Record<string, unknown>
    plain_text: string
  }) => void
}

function extractPlainText(json: Record<string, unknown>): string {
  // Recursively extract text from TipTap JSON
  function walk(node: Record<string, unknown>): string {
    if (node.text && typeof node.text === 'string') return node.text

    const content = node.content as Record<string, unknown>[] | undefined
    if (Array.isArray(content)) {
      return content.map(walk).join('')
    }

    return ''
  }

  const content = json.content as Record<string, unknown>[] | undefined
  if (!Array.isArray(content)) return ''

  return content
    .map(walk)
    .filter(Boolean)
    .join('\n')
}

function extractTitle(json: Record<string, unknown>): string {
  const content = json.content as Record<string, unknown>[] | undefined
  if (!Array.isArray(content) || content.length === 0) return 'Untitled'

  const firstBlock = content[0]
  const blockContent = firstBlock.content as Record<string, unknown>[] | undefined
  if (!Array.isArray(blockContent) || blockContent.length === 0) return 'Untitled'

  const text = blockContent.map((n) => (n.text as string) || '').join('')
  return text.trim() || 'Untitled'
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const isUpdatingRef = useRef(false)

  const debouncedSave = useDebouncedCallback(
    (json: Record<string, unknown>) => {
      const title = extractTitle(json)
      const plain_text = extractPlainText(json)
      onUpdate({ title, content: json, plain_text })
    },
    1000,
  )

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: note.content as Record<string, unknown> | null ?? undefined,
    onUpdate: ({ editor: ed }) => {
      if (isUpdatingRef.current) return
      const json = ed.getJSON() as Record<string, unknown>
      debouncedSave(json)
    },
  })

  // When note prop changes (switching notes), update editor content
  const handleNoteChange = useCallback(() => {
    if (!editor) return
    isUpdatingRef.current = true
    const content = note.content as Record<string, unknown> | null
    editor.commands.setContent(content ?? { type: 'doc', content: [] })
    isUpdatingRef.current = false
  }, [editor, note.content])

  const prevNoteIdRef = useRef(note.id)
  useEffect(() => {
    if (note.id !== prevNoteIdRef.current) {
      prevNoteIdRef.current = note.id
      handleNoteChange()
    }
  }, [note.id, handleNoteChange])

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar editor={editor} />
      <div className="flex-1 min-h-0 overflow-auto">
        <EditorContent
          editor={editor}
          className="h-full [&_.tiptap]:h-full [&_.tiptap]:px-6 [&_.tiptap]:py-4 [&_.tiptap]:outline-none [&_.tiptap]:text-sm [&_.tiptap]:leading-relaxed [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-bold [&_.tiptap_h1]:mb-2 [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-semibold [&_.tiptap_h2]:mb-2 [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-medium [&_.tiptap_h3]:mb-1 [&_.tiptap_p]:mb-1 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6 [&_.tiptap_pre]:bg-[var(--color-bg-tertiary)] [&_.tiptap_pre]:rounded-[var(--radius-md)] [&_.tiptap_pre]:p-3 [&_.tiptap_pre]:text-xs [&_.tiptap_pre]:font-mono [&_.tiptap_hr]:border-[var(--color-border-subtle)] [&_.tiptap_hr]:my-4 [&_.tiptap_a]:text-[var(--color-accent)] [&_.tiptap_a]:underline [&_.tiptap_.is-editor-empty:first-child::before]:text-[var(--color-text-tertiary)] [&_.tiptap_.is-editor-empty:first-child::before]:float-left [&_.tiptap_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_.is-editor-empty:first-child::before]:h-0"
          style={{ color: 'var(--color-text-primary)' }}
        />
      </div>
    </div>
  )
}
