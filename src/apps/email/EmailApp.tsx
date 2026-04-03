import { useState, useMemo } from 'react'
import {
  Inbox,
  Send as SendIcon,
  FileEdit,
  Archive,
  Star,
  Paperclip,
  Search,
  ChevronLeft,
  Clock,
  CheckCircle,
  Pencil,
  Send,
  Eye,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { sampleEmails } from './sample-data'
import type { EmailFolder, EmailMessage } from './types'

const FOLDERS: { id: EmailFolder; label: string; Icon: typeof Inbox }[] = [
  { id: 'inbox', label: 'Bandeja de entrada', Icon: Inbox },
  { id: 'sent', label: 'Enviados', Icon: SendIcon },
  { id: 'drafts', label: 'Borradores', Icon: FileEdit },
  { id: 'archive', label: 'Archivo', Icon: Archive },
]

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()

  if (isToday) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days < 7) {
    return d.toLocaleDateString([], { weekday: 'short' })
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const DRAFT_STATUS_MAP = {
  pending_review: {
    label: 'Pendiente de revision',
    color: 'var(--color-warning)',
    bg: 'rgba(196, 132, 29, 0.1)',
    Icon: Clock,
  },
  approved: {
    label: 'Aprobado para enviar',
    color: 'var(--color-success)',
    bg: 'rgba(74, 124, 89, 0.1)',
    Icon: CheckCircle,
  },
  editing: {
    label: 'En edicion',
    color: 'var(--color-info)',
    bg: 'rgba(74, 111, 165, 0.1)',
    Icon: Pencil,
  },
} as const

export function EmailApp() {
  const [folder, setFolder] = useState<EmailFolder>('inbox')
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [emails, setEmails] = useState(sampleEmails)

  // Group emails into threads, pick the latest message per thread for the list
  const threadSummaries = useMemo(() => {
    // Filter by folder: show threads that have at least one message in the folder
    const inFolder = emails.filter((e) => e.folder === folder)
    // Group by threadId
    const threadMap = new Map<string, EmailMessage[]>()
    for (const e of inFolder) {
      const list = threadMap.get(e.threadId) || []
      list.push(e)
      threadMap.set(e.threadId, list)
    }

    // Build summaries
    const summaries = Array.from(threadMap.entries()).map(([threadId, msgs]) => {
      const sorted = msgs.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      const latest = sorted[0]
      // Count all messages in this thread (across all folders)
      const allInThread = emails.filter((e) => e.threadId === threadId)
      const hasUnread = msgs.some((m) => !m.read)
      return {
        threadId,
        latest,
        messageCount: allInThread.length,
        hasUnread,
        subject: latest.subject.replace(/^Re:\s*/i, ''),
      }
    })

    // Apply search filter
    let filtered = summaries
    if (search) {
      const q = search.toLowerCase()
      filtered = summaries.filter(
        (s) =>
          s.subject.toLowerCase().includes(q) ||
          s.latest.from.name.toLowerCase().includes(q) ||
          s.latest.body.toLowerCase().includes(q)
      )
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.latest.date).getTime() - new Date(a.latest.date).getTime()
    )
  }, [emails, folder, search])

  // Get full thread for selected
  const selectedThread = useMemo(() => {
    if (!selectedThreadId) return null
    const msgs = emails
      .filter((e) => e.threadId === selectedThreadId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return msgs.length > 0 ? msgs : null
  }, [emails, selectedThreadId])

  function toggleStar(id: string) {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e))
    )
  }

  function markThreadRead(threadId: string) {
    setEmails((prev) =>
      prev.map((e) =>
        e.threadId === threadId ? { ...e, read: true } : e
      )
    )
  }

  function approveDraft(id: string) {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, draftStatus: 'approved' } : e
      )
    )
  }

  function sendDraft(id: string) {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, folder: 'sent' as const, isDraft: false, draftStatus: undefined }
          : e
      )
    )
  }

  const unreadByFolder = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const e of emails) {
      if (!e.read) counts[e.folder] = (counts[e.folder] || 0) + 1
    }
    return counts
  }, [emails])

  const draftCount = useMemo(
    () => emails.filter((e) => e.folder === 'drafts').length,
    [emails]
  )

  const pendingReviewCount = useMemo(
    () => emails.filter((e) => e.draftStatus === 'pending_review').length,
    [emails]
  )

  return (
    <div className="flex h-full bg-[var(--color-bg-elevated)] @container">
      {/* Sidebar */}
      <div
        className={cn(
          'w-44 shrink-0 border-r py-3 flex flex-col',
          selectedThread && '@[0px]:hidden @[700px]:flex'
        )}
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <nav className="space-y-0.5 px-2">
          {FOLDERS.map(({ id, label, Icon }) => {
            const count =
              id === 'drafts' ? draftCount : unreadByFolder[id] || 0
            return (
              <button
                key={id}
                onClick={() => {
                  setFolder(id)
                  setSelectedThreadId(null)
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors text-left',
                  folder === id
                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-medium'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
                )}
              >
                <Icon size={14} />
                <span className="flex-1 truncate">{label}</span>
                {count > 0 && (
                  <span className="text-[10px] font-medium bg-[var(--color-accent)] text-[var(--color-text-inverse)] rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Pending review summary */}
        {pendingReviewCount > 0 && (
          <div className="mx-2 mt-3 px-3 py-2 rounded-[var(--radius-md)]" style={{ background: 'rgba(196, 132, 29, 0.08)' }}>
            <p className="text-[10px] font-medium" style={{ color: 'var(--color-warning)' }}>
              {pendingReviewCount} borrador{pendingReviewCount > 1 ? 'es' : ''} pendiente{pendingReviewCount > 1 ? 's' : ''}
            </p>
          </div>
        )}

        <div
          className="mt-auto px-3 pt-3 border-t"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <p className="text-[10px] text-[var(--color-text-tertiary)] text-center">
            luba@uniquecaboweddings.com
          </p>
        </div>
      </div>

      {/* Thread list */}
      <div
        className={cn(
          'w-72 shrink-0 border-r flex flex-col',
          selectedThread ? '@[0px]:hidden @[700px]:flex' : 'flex',
          !selectedThread &&
            '@[0px]:flex-1 @[700px]:w-72 @[700px]:flex-none'
        )}
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        {/* Search */}
        <div
          className="px-3 py-2 border-b"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border border-transparent focus-within:border-[var(--color-accent)] transition-colors">
            <Search
              size={13}
              className="text-[var(--color-text-tertiary)] shrink-0"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar correos..."
              className="flex-1 bg-transparent text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {threadSummaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 px-6">
              <Inbox
                size={24}
                className="text-[var(--color-text-tertiary)]"
              />
              <p className="text-xs text-[var(--color-text-tertiary)] text-center">
                {search ? 'Sin resultados' : 'No hay correos'}
              </p>
            </div>
          ) : (
            threadSummaries.map((thread) => {
              const { latest } = thread
              const isDraftView = folder === 'drafts'
              const draftInfo = isDraftView && latest.draftStatus
                ? DRAFT_STATUS_MAP[latest.draftStatus]
                : null

              return (
                <button
                  key={thread.threadId}
                  onClick={() => {
                    setSelectedThreadId(thread.threadId)
                    markThreadRead(thread.threadId)
                  }}
                  className={cn(
                    'w-full text-left px-3 py-2.5 border-b transition-colors',
                    selectedThreadId === thread.threadId
                      ? 'bg-[var(--color-accent-subtle)]'
                      : 'hover:bg-[var(--color-bg-secondary)]',
                    thread.hasUnread && 'bg-[var(--color-bg-primary)]'
                  )}
                  style={{ borderColor: 'var(--color-border-subtle)' }}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={cn(
                        'text-xs truncate flex-1',
                        thread.hasUnread
                          ? 'font-medium text-[var(--color-text-primary)]'
                          : 'text-[var(--color-text-secondary)]'
                      )}
                    >
                      {folder === 'sent' || folder === 'drafts'
                        ? latest.to.name
                        : latest.from.name}
                    </span>
                    {thread.messageCount > 1 && (
                      <span className="text-[10px] text-[var(--color-text-tertiary)] bg-[var(--color-bg-tertiary)] rounded-full px-1.5 py-0.5 shrink-0">
                        {thread.messageCount}
                      </span>
                    )}
                    <span className="text-[10px] text-[var(--color-text-tertiary)] shrink-0">
                      {formatDate(latest.date)}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'text-xs truncate',
                      thread.hasUnread
                        ? 'text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)]'
                    )}
                  >
                    {thread.subject}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-tertiary)] truncate mt-0.5">
                    {latest.body.split('\n')[0]}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {latest.starred && (
                      <Star
                        size={10}
                        className="text-[var(--color-warning)] fill-[var(--color-warning)]"
                      />
                    )}
                    {latest.attachments && latest.attachments.length > 0 && (
                      <Paperclip
                        size={10}
                        className="text-[var(--color-text-tertiary)]"
                      />
                    )}
                    {draftInfo && (
                      <span
                        className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        style={{ background: draftInfo.bg, color: draftInfo.color }}
                      >
                        <draftInfo.Icon size={9} />
                        {draftInfo.label}
                      </span>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Thread detail */}
      {selectedThread ? (
        <ThreadDetail
          messages={selectedThread}
          onBack={() => setSelectedThreadId(null)}
          onToggleStar={toggleStar}
          onApproveDraft={approveDraft}
          onSendDraft={sendDraft}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center @[0px]:hidden @[700px]:flex">
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Selecciona un correo
          </p>
        </div>
      )}
    </div>
  )
}

function ThreadDetail({
  messages,
  onBack,
  onToggleStar,
  onApproveDraft,
  onSendDraft,
}: {
  messages: EmailMessage[]
  onBack: () => void
  onToggleStar: (id: string) => void
  onApproveDraft: (id: string) => void
  onSendDraft: (id: string) => void
}) {
  const subject = messages[0].subject.replace(/^Re:\s*/i, '')
  const latestStarred = messages.some((m) => m.starred)
  const latestId = messages[messages.length - 1].id

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Thread header */}
      <div
        className="px-4 py-3 border-b flex items-center gap-3 shrink-0"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <button
          onClick={onBack}
          className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors @[700px]:hidden"
          aria-label="Back"
        >
          <ChevronLeft
            size={16}
            className="text-[var(--color-text-secondary)]"
          />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {subject}
            </h2>
            {messages.length > 1 && (
              <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-tertiary)] bg-[var(--color-bg-tertiary)] rounded-full px-2 py-0.5 shrink-0">
                <MessageSquare size={9} />
                {messages.length} mensajes
              </span>
            )}
            <button
              onClick={() => onToggleStar(latestId)}
              className="shrink-0"
              aria-label={latestStarred ? 'Unstar' : 'Star'}
            >
              <Star
                size={14}
                className={
                  latestStarred
                    ? 'text-[var(--color-warning)] fill-[var(--color-warning)]'
                    : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-warning)]'
                }
              />
            </button>
          </div>
        </div>
      </div>

      {/* Thread messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isLast={i === messages.length - 1}
              defaultExpanded={i === messages.length - 1 || messages.length <= 3}
              onApproveDraft={onApproveDraft}
              onSendDraft={onSendDraft}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  isLast,
  defaultExpanded,
  onApproveDraft,
  onSendDraft,
}: {
  message: EmailMessage
  isLast: boolean
  defaultExpanded: boolean
  onApproveDraft: (id: string) => void
  onSendDraft: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const isFromLuba = message.from.email === 'luba@uniquecaboweddings.com'
  const draftInfo = message.isDraft && message.draftStatus
    ? DRAFT_STATUS_MAP[message.draftStatus]
    : null

  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border overflow-hidden',
        message.isDraft && 'border-dashed',
      )}
      style={{
        borderColor: draftInfo
          ? draftInfo.color
          : 'var(--color-border)',
        background: 'var(--color-bg-elevated)',
      }}
    >
      {/* Message header — click to expand/collapse */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: isFromLuba
              ? 'var(--color-accent)'
              : 'var(--color-ocean)',
          }}
        >
          <span className="text-[10px] font-medium text-[var(--color-text-inverse)]">
            {message.from.name.charAt(0)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-[var(--color-text-primary)] truncate">
              {message.from.name}
            </span>
            {isFromLuba && (
              <span className="text-[9px] text-[var(--color-accent)] bg-[var(--color-accent-subtle)] rounded px-1 py-0.5">
                UCW
              </span>
            )}
          </div>
          {!expanded && (
            <p className="text-[11px] text-[var(--color-text-tertiary)] truncate">
              {message.body.split('\n')[0]}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {draftInfo && (
            <span
              className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
              style={{ background: draftInfo.bg, color: draftInfo.color }}
            >
              <draftInfo.Icon size={9} />
              {draftInfo.label}
            </span>
          )}
          <span className="text-[10px] text-[var(--color-text-tertiary)]">
            {formatFullDate(message.date)}
          </span>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-4">
          <div className="text-[10px] text-[var(--color-text-tertiary)] mb-3 flex items-center gap-1">
            Para: {message.to.name} &lt;{message.to.email}&gt;
          </div>

          <pre className="text-[13px] text-[var(--color-text-primary)] whitespace-pre-wrap font-[var(--font-sans)] leading-relaxed">
            {message.body}
          </pre>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div
              className="mt-4 pt-3 border-t"
              style={{ borderColor: 'var(--color-border-subtle)' }}
            >
              <p className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                Adjuntos
              </p>
              <div className="flex flex-wrap gap-2">
                {message.attachments.map((att) => (
                  <div
                    key={att.name}
                    className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border bg-[var(--color-bg-secondary)]"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <Paperclip
                      size={12}
                      className="text-[var(--color-text-tertiary)]"
                    />
                    <div>
                      <p className="text-xs text-[var(--color-text-primary)]">
                        {att.name}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-tertiary)]">
                        {att.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Draft actions */}
          {message.isDraft && (
            <div
              className="mt-4 pt-3 border-t flex items-center gap-2"
              style={{ borderColor: 'var(--color-border-subtle)' }}
            >
              {message.draftStatus === 'pending_review' && (
                <>
                  <button
                    onClick={() => onApproveDraft(message.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors"
                    style={{
                      background: 'var(--color-success)',
                      color: 'white',
                    }}
                  >
                    <CheckCircle size={12} />
                    Aprobar
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] border transition-colors hover:bg-[var(--color-bg-tertiary)]"
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <Pencil size={12} />
                    Editar
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] border transition-colors hover:bg-[var(--color-bg-tertiary)]"
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <Eye size={12} />
                    Vista previa
                  </button>
                </>
              )}
              {message.draftStatus === 'approved' && (
                <button
                  onClick={() => onSendDraft(message.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] text-[var(--color-text-inverse)] transition-colors hover:opacity-90"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <Send size={12} />
                  Enviar ahora
                </button>
              )}
              {message.draftStatus === 'editing' && (
                <span className="flex items-center gap-1.5 text-xs text-[var(--color-info)]">
                  <Pencil size={12} />
                  En edicion — guarda los cambios antes de enviar
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
