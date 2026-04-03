import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Link,
  Minus,
} from 'lucide-react'
import type { Editor } from '@tiptap/react'
import { cn } from '@/lib/cn'

interface EditorToolbarProps {
  editor: Editor | null
}

interface ToolbarAction {
  icon: typeof Bold
  title: string
  isActive: () => boolean
  onClick: () => void
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  const actions: ToolbarAction[] = [
    {
      icon: Bold,
      title: 'Bold',
      isActive: () => editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      title: 'Italic',
      isActive: () => editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: Heading1,
      title: 'Heading 1',
      isActive: () => editor.isActive('heading', { level: 1 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2,
      title: 'Heading 2',
      isActive: () => editor.isActive('heading', { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: Heading3,
      title: 'Heading 3',
      isActive: () => editor.isActive('heading', { level: 3 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      icon: List,
      title: 'Bullet list',
      isActive: () => editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      title: 'Ordered list',
      isActive: () => editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: Code,
      title: 'Code block',
      isActive: () => editor.isActive('codeBlock'),
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      icon: Link,
      title: 'Link',
      isActive: () => editor.isActive('link'),
      onClick: () => {
        if (editor.isActive('link')) {
          editor.chain().focus().unsetLink().run()
          return
        }
        const url = window.prompt('URL:')
        if (url) {
          editor.chain().focus().setLink({ href: url }).run()
        }
      },
    },
    {
      icon: Minus,
      title: 'Divider',
      isActive: () => false,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ]

  return (
    <div
      className="flex items-center gap-0.5 px-3 py-1.5 border-b overflow-x-auto shrink-0"
      style={{ borderColor: 'var(--color-border-subtle)' }}
    >
      {actions.map((action) => (
        <button
          key={action.title}
          onClick={action.onClick}
          title={action.title}
          className={cn(
            'p-1.5 rounded-[var(--radius-sm)] transition-colors shrink-0',
            action.isActive()
              ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
              : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-secondary)]',
          )}
        >
          <action.icon size={14} />
        </button>
      ))}
    </div>
  )
}
