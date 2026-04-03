import { useState, useMemo } from 'react'
import {
  Inbox,
  Send,
  FileEdit,
  Archive,
  Star,
  Paperclip,
  Search,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { sampleEmails } from './sample-data'
import type { EmailFolder, EmailMessage } from './types'

const FOLDERS: { id: EmailFolder; label: string; Icon: typeof Inbox }[] = [
  { id: 'inbox', label: 'Bandeja de entrada', Icon: Inbox },
  { id: 'sent', label: 'Enviados', Icon: Send },
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

export function EmailApp() {
  const [folder, setFolder] = useState<EmailFolder>('inbox')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [emails, setEmails] = useState(sampleEmails)

  const filtered = useMemo(() => {
    let list = emails.filter((e) => e.folder === folder)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.from.name.toLowerCase().includes(q) ||
          e.body.toLowerCase().includes(q)
      )
    }
    return list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [emails, folder, search])

  const selected = selectedId ? emails.find((e) => e.id === selectedId) : null

  function toggleStar(id: string) {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e))
    )
  }

  function markRead(id: string) {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, read: true } : e))
    )
  }

  const unreadByFolder = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const e of emails) {
      if (!e.read) counts[e.folder] = (counts[e.folder] || 0) + 1
    }
    return counts
  }, [emails])

  return (
    <div className="flex h-full bg-[var(--color-bg-elevated)] @container">
      {/* Sidebar */}
      <div
        className={cn(
          'w-44 shrink-0 border-r py-3 flex flex-col',
          selected && '@[0px]:hidden @[700px]:flex'
        )}
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <nav className="space-y-0.5 px-2">
          {FOLDERS.map(({ id, label, Icon }) => {
            const count = unreadByFolder[id] || 0
            return (
              <button
                key={id}
                onClick={() => {
                  setFolder(id)
                  setSelectedId(null)
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

        <div className="mt-auto px-3 pt-3 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <p className="text-[10px] text-[var(--color-text-tertiary)] text-center">
            luba@uniquecaboweddings.com
          </p>
        </div>
      </div>

      {/* Email list */}
      <div
        className={cn(
          'w-72 shrink-0 border-r flex flex-col',
          selected ? '@[0px]:hidden @[700px]:flex' : 'flex',
          !selected && '@[0px]:flex-1 @[700px]:w-72 @[700px]:flex-none'
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
          {filtered.length === 0 ? (
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
            filtered.map((email) => (
              <button
                key={email.id}
                onClick={() => {
                  setSelectedId(email.id)
                  markRead(email.id)
                }}
                className={cn(
                  'w-full text-left px-3 py-2.5 border-b transition-colors',
                  selectedId === email.id
                    ? 'bg-[var(--color-accent-subtle)]'
                    : 'hover:bg-[var(--color-bg-secondary)]',
                  !email.read && 'bg-[var(--color-bg-primary)]'
                )}
                style={{ borderColor: 'var(--color-border-subtle)' }}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={cn(
                      'text-xs truncate flex-1',
                      !email.read
                        ? 'font-medium text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)]'
                    )}
                  >
                    {folder === 'sent' || folder === 'drafts'
                      ? email.to.name
                      : email.from.name}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-tertiary)] shrink-0">
                    {formatDate(email.date)}
                  </span>
                </div>
                <p
                  className={cn(
                    'text-xs truncate',
                    !email.read
                      ? 'text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-secondary)]'
                  )}
                >
                  {email.subject}
                </p>
                <p className="text-[11px] text-[var(--color-text-tertiary)] truncate mt-0.5">
                  {email.body.split('\n')[0]}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {email.starred && (
                    <Star
                      size={10}
                      className="text-[var(--color-warning)] fill-[var(--color-warning)]"
                    />
                  )}
                  {email.attachments && email.attachments.length > 0 && (
                    <Paperclip
                      size={10}
                      className="text-[var(--color-text-tertiary)]"
                    />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Email detail */}
      {selected ? (
        <EmailDetail
          email={selected}
          onBack={() => setSelectedId(null)}
          onToggleStar={toggleStar}
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

function EmailDetail({
  email,
  onBack,
  onToggleStar,
}: {
  email: EmailMessage
  onBack: () => void
  onToggleStar: (id: string) => void
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-start gap-3"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <button
          onClick={onBack}
          className="mt-0.5 w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors @[700px]:hidden"
          aria-label="Back"
        >
          <ChevronLeft size={16} className="text-[var(--color-text-secondary)]" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {email.subject}
            </h2>
            <button
              onClick={() => onToggleStar(email.id)}
              className="shrink-0"
              aria-label={email.starred ? 'Unstar' : 'Star'}
            >
              <Star
                size={14}
                className={
                  email.starred
                    ? 'text-[var(--color-warning)] fill-[var(--color-warning)]'
                    : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-warning)]'
                }
              />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center shrink-0">
              <span className="text-[9px] font-medium text-[var(--color-text-inverse)]">
                {email.from.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[var(--color-text-primary)] truncate">
                {email.from.name}{' '}
                <span className="text-[var(--color-text-tertiary)]">
                  &lt;{email.from.email}&gt;
                </span>
              </p>
              <p className="text-[10px] text-[var(--color-text-tertiary)]">
                Para: {email.to.name} &lt;{email.to.email}&gt;
              </p>
            </div>
            <span className="ml-auto text-[10px] text-[var(--color-text-tertiary)] shrink-0">
              {new Date(email.date).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <pre className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap font-[var(--font-sans)] leading-relaxed">
            {email.body}
          </pre>

          {email.attachments && email.attachments.length > 0 && (
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <p className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                Adjuntos
              </p>
              <div className="flex flex-wrap gap-2">
                {email.attachments.map((att) => (
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
        </div>
      </div>
    </div>
  )
}
