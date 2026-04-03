import { useState } from 'react'
import { Search, Star } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { DbContact, ContactRelationship } from '@/types/database'

const RELATIONSHIP_FILTERS: { value: ContactRelationship | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'friend', label: 'Friends' },
  { value: 'family', label: 'Family' },
  { value: 'coworker', label: 'Coworkers' },
  { value: 'client', label: 'Clients' },
  { value: 'partner', label: 'Partners' },
]

const INITIALS_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6',
]

function getInitialsColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return INITIALS_COLORS[Math.abs(hash) % INITIALS_COLORS.length]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface ContactListProps {
  contacts: DbContact[]
  selectedId: string | null
  onSelect: (contact: DbContact) => void
}

export function ContactList({ contacts, selectedId, onSelect }: ContactListProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<ContactRelationship | 'all'>('all')

  const filtered = contacts.filter((c) => {
    if (filter !== 'all' && c.relationship !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      )
    }
    return true
  })

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-2">
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-md)] border"
          style={{
            background: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border)',
          }}
        >
          <Search size={13} style={{ color: 'var(--color-text-tertiary)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="flex-1 text-xs bg-transparent outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
          />
        </div>
      </div>

      {/* Relationship filter tabs */}
      <div
        className="flex gap-0.5 px-2 pb-2 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {RELATIONSHIP_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-2 py-1 text-[10px] font-medium rounded-[var(--radius-sm)] whitespace-nowrap transition-colors',
              filter === f.value
                ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Contact list */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              No contacts found
            </p>
          </div>
        ) : (
          filtered.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onSelect(contact)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors',
                selectedId === contact.id
                  ? 'bg-[var(--color-accent)]/10'
                  : 'hover:bg-[var(--color-bg-tertiary)]',
              )}
              style={
                selectedId === contact.id
                  ? { borderRight: '2px solid var(--color-accent)' }
                  : undefined
              }
            >
              {/* Avatar */}
              {contact.avatar_url ? (
                <img
                  src={contact.avatar_url}
                  alt={contact.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: getInitialsColor(contact.name) }}
                >
                  <span className="text-[10px] font-bold text-white">
                    {getInitials(contact.name)}
                  </span>
                </div>
              )}

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium truncate text-[var(--color-text-primary)]">
                    {contact.name}
                  </span>
                  {contact.favorite && (
                    <Star
                      size={10}
                      className="shrink-0 fill-current"
                      style={{ color: 'var(--color-accent)' }}
                    />
                  )}
                </div>
                <span className="text-[10px] truncate block text-[var(--color-text-tertiary)]">
                  {contact.company || contact.relationship}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
