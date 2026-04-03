import { useState } from 'react'
import { Plus, Pencil, Trash2, MessageSquare } from 'lucide-react'
import { useConversations } from './hooks'
import type { DbAiConversation } from '@/types/database'

interface Props {
  activeId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ activeId, onSelect }: Props) {
  const { conversations, isLoading, createConversation, updateConversation, deleteConversation } = useConversations()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null)

  const handleNew = async () => {
    const conv = await createConversation.mutateAsync(undefined)
    onSelect(conv.id)
  }

  const handleContextMenu = (e: React.MouseEvent, conv: DbAiConversation) => {
    e.preventDefault()
    setContextMenu({ id: conv.id, x: e.clientX, y: e.clientY })
  }

  const handleRename = (conv: DbAiConversation) => {
    setEditingId(conv.id)
    setEditTitle(conv.title)
    setContextMenu(null)
  }

  const handleSaveRename = () => {
    if (editingId && editTitle.trim()) {
      updateConversation.mutate({ id: editingId, title: editTitle.trim() })
    }
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    deleteConversation.mutate(id)
    if (activeId === id) {
      onSelect('')
    }
    setContextMenu(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* New chat button */}
      <div className="p-2 shrink-0">
        <button
          onClick={handleNew}
          disabled={createConversation.isPending}
          className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors"
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-accent-foreground)',
          }}
        >
          <Plus size={14} />
          New chat
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-3 text-center">
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Loading...
            </span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-3 text-center">
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              No conversations yet
            </span>
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              onContextMenu={(e) => handleContextMenu(e, conv)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
              style={{
                background: activeId === conv.id ? 'var(--color-bg-tertiary)' : undefined,
              }}
            >
              <MessageSquare
                size={12}
                className="shrink-0"
                style={{ color: 'var(--color-text-tertiary)' }}
              />
              {editingId === conv.id ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleSaveRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveRename()
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                  className="flex-1 text-xs px-1 py-0.5 rounded outline-none"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              ) : (
                <span
                  className="flex-1 text-xs truncate"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {conv.title}
                </span>
              )}
            </button>
          ))
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0" style={{ zIndex: 99 }} onClick={() => setContextMenu(null)} />
          <div
            className="fixed py-1"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
              zIndex: 100,
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              minWidth: 140,
            }}
          >
            <button
              onClick={() => {
                const conv = conversations.find((c) => c.id === contextMenu.id)
                if (conv) handleRename(conv)
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors hover:bg-[var(--color-bg-tertiary)]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <Pencil size={12} />
              Rename
            </button>
            <button
              onClick={() => handleDelete(contextMenu.id)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors hover:bg-[var(--color-bg-tertiary)]"
              style={{ color: '#ef4444' }}
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}
