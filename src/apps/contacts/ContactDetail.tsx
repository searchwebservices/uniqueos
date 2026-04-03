import { useRef, useState } from 'react'
import {
  Phone,
  Mail,
  Star,
  Edit,
  Trash2,
  MessageCircle,
  Globe,
  Building,
  MapPin,
  Tag,
  X,
  Camera,
  AtSign,
  Link2,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import type { DbContact } from '@/types/database'

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

const RELATIONSHIP_LABELS: Record<string, string> = {
  friend: 'Friend',
  family: 'Family',
  coworker: 'Coworker',
  client: 'Client',
  partner: 'Partner',
  vendor: 'Vendor',
  other: 'Other',
}

const SOCIAL_CONFIG: {
  key: string
  label: string
  icon: typeof Globe
  urlPrefix?: string
}[] = [
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, urlPrefix: 'https://wa.me/' },
  { key: 'instagram', label: 'Instagram', icon: AtSign, urlPrefix: 'https://instagram.com/' },
  { key: 'linkedin', label: 'LinkedIn', icon: Link2 },
  { key: 'twitter', label: 'Twitter', icon: AtSign, urlPrefix: 'https://twitter.com/' },
  { key: 'github', label: 'GitHub', icon: Link2, urlPrefix: 'https://github.com/' },
  { key: 'facebook', label: 'Facebook', icon: Globe, urlPrefix: 'https://facebook.com/' },
  { key: 'website', label: 'Website', icon: Globe },
]

interface ContactDetailProps {
  contact: DbContact
  onEdit: () => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string, favorite: boolean) => void
  onUploadAvatar: (contactId: string, file: File) => void
}

export function ContactDetail({
  contact,
  onEdit,
  onDelete,
  onToggleFavorite,
  onUploadAvatar,
}: ContactDetailProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAvatarClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      onUploadAvatar(contact.id, file)
    }
  }

  function handleDelete() {
    if (confirmDelete) {
      onDelete(contact.id)
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
    }
  }

  const activeSocials = SOCIAL_CONFIG.filter(
    (s) => contact.socials?.[s.key],
  )

  function getSocialUrl(key: string, value: string): string {
    const config = SOCIAL_CONFIG.find((s) => s.key === key)
    if (!config) return value
    if (value.startsWith('http')) return value
    if (config.urlPrefix) {
      const clean = value.replace(/^@/, '')
      return config.urlPrefix + clean
    }
    return value
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top section: avatar + name + actions */}
      <div className="flex items-start gap-5 mb-6">
        {/* Avatar with upload overlay */}
        <div className="relative group shrink-0">
          {contact.avatar_url ? (
            <img
              src={contact.avatar_url}
              alt={contact.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: getInitialsColor(contact.name) }}
            >
              <span className="text-xl font-bold text-white">
                {getInitials(contact.name)}
              </span>
            </div>
          )}
          <button
            onClick={handleAvatarClick}
            className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera size={18} className="text-white" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold truncate text-[var(--color-text-primary)]">
              {contact.name}
            </h2>
            <button
              onClick={() => onToggleFavorite(contact.id, !contact.favorite)}
              className="shrink-0"
              title={contact.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                size={16}
                className={cn(
                  'transition-colors',
                  contact.favorite
                    ? 'fill-current'
                    : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)]',
                )}
                style={contact.favorite ? { color: 'var(--color-accent)' } : undefined}
              />
            </button>
          </div>

          {contact.nickname && (
            <p className="text-sm text-[var(--color-text-secondary)]">
              &quot;{contact.nickname}&quot;
            </p>
          )}

          {/* Relationship badge */}
          <span
            className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-medium rounded-full"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-text-inverse)',
              opacity: 0.9,
            }}
          >
            {RELATIONSHIP_LABELS[contact.relationship] ?? contact.relationship}
          </span>

          {/* Tags */}
          {contact.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <Tag size={10} style={{ color: 'var(--color-text-tertiary)' }} />
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-[10px] rounded-[var(--radius-sm)] border"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            title="Edit"
          >
            <Edit size={14} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
          <button
            onClick={handleDelete}
            className={cn(
              'w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] transition-colors',
              confirmDelete
                ? 'bg-[var(--color-error)]/10'
                : 'hover:bg-[var(--color-bg-tertiary)]',
            )}
            title={confirmDelete ? 'Click again to confirm' : 'Delete'}
          >
            {confirmDelete ? (
              <X size={14} style={{ color: 'var(--color-error)' }} />
            ) : (
              <Trash2 size={14} style={{ color: 'var(--color-text-secondary)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div
        className="border-b mb-5"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      />

      {/* Contact methods */}
      <div className="space-y-4">
        {/* Phone */}
        {contact.phone && (
          <div className="flex items-center gap-3">
            <Phone size={14} style={{ color: 'var(--color-text-tertiary)' }} />
            <div className="flex items-center gap-2">
              <a
                href={`tel:${contact.phone}`}
                className="text-sm text-[var(--color-text-primary)] hover:underline"
              >
                {contact.phone}
              </a>
              {contact.socials?.whatsapp && (
                <a
                  href={`https://wa.me/${contact.socials.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <MessageCircle size={10} />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

        {/* Email */}
        {contact.email && (
          <div className="flex items-center gap-3">
            <Mail size={14} style={{ color: 'var(--color-text-tertiary)' }} />
            <a
              href={`mailto:${contact.email}`}
              className="text-sm text-[var(--color-text-primary)] hover:underline"
            >
              {contact.email}
            </a>
          </div>
        )}

        {/* Socials row */}
        {activeSocials.length > 0 && (
          <div className="flex items-center gap-2 pl-[26px]">
            {activeSocials.map((social) => {
              const Icon = social.icon
              const value = contact.socials[social.key]!
              const url = getSocialUrl(social.key, value)
              return (
                <a
                  key={social.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] border hover:bg-[var(--color-bg-tertiary)] transition-colors"
                  style={{ borderColor: 'var(--color-border)' }}
                  title={social.label}
                >
                  <Icon size={13} style={{ color: 'var(--color-text-secondary)' }} />
                </a>
              )
            })}
          </div>
        )}

        {/* Company / Job title */}
        {(contact.company || contact.job_title) && (
          <div className="flex items-center gap-3">
            <Building size={14} style={{ color: 'var(--color-text-tertiary)' }} />
            <span className="text-sm text-[var(--color-text-primary)]">
              {[contact.job_title, contact.company].filter(Boolean).join(' at ')}
            </span>
          </div>
        )}

        {/* Address */}
        {contact.address && (
          <div className="flex items-start gap-3">
            <MapPin
              size={14}
              className="shrink-0 mt-0.5"
              style={{ color: 'var(--color-text-tertiary)' }}
            />
            <span className="text-sm text-[var(--color-text-primary)] whitespace-pre-line">
              {contact.address}
            </span>
          </div>
        )}

        {/* Notes */}
        {contact.notes && (
          <>
            <div
              className="border-b mt-4"
              style={{ borderColor: 'var(--color-border-subtle)' }}
            />
            <div>
              <p className="text-xs font-medium mb-1.5 text-[var(--color-text-secondary)]">
                Notes
              </p>
              <p className="text-sm whitespace-pre-line text-[var(--color-text-primary)]">
                {contact.notes}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
