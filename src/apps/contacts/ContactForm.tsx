import { useState, type FormEvent } from 'react'
import { X, ChevronDown } from 'lucide-react'
import type { DbContact, ContactRelationship } from '@/types/database'

const RELATIONSHIP_OPTIONS: { value: ContactRelationship; label: string }[] = [
  { value: 'friend', label: 'Friend' },
  { value: 'family', label: 'Family' },
  { value: 'coworker', label: 'Coworker' },
  { value: 'client', label: 'Client' },
  { value: 'partner', label: 'Partner' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'other', label: 'Other' },
]

interface ContactFormProps {
  contact?: DbContact | null
  onSave: (data: Partial<Omit<DbContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => void
  onClose: () => void
}

export function ContactForm({ contact, onSave, onClose }: ContactFormProps) {
  const [name, setName] = useState(contact?.name ?? '')
  const [nickname, setNickname] = useState(contact?.nickname ?? '')
  const [email, setEmail] = useState(contact?.email ?? '')
  const [phone, setPhone] = useState(contact?.phone ?? '')
  const [relationship, setRelationship] = useState<ContactRelationship>(
    contact?.relationship ?? 'other',
  )
  const [company, setCompany] = useState(contact?.company ?? '')
  const [jobTitle, setJobTitle] = useState(contact?.job_title ?? '')
  const [tagsInput, setTagsInput] = useState(contact?.tags?.join(', ') ?? '')
  const [address, setAddress] = useState(contact?.address ?? '')
  const [notes, setNotes] = useState(contact?.notes ?? '')
  const [showSocials, setShowSocials] = useState(false)

  const [whatsapp, setWhatsapp] = useState(contact?.socials?.whatsapp ?? '')
  const [instagram, setInstagram] = useState(contact?.socials?.instagram ?? '')
  const [linkedin, setLinkedin] = useState(contact?.socials?.linkedin ?? '')
  const [twitter, setTwitter] = useState(contact?.socials?.twitter ?? '')
  const [website, setWebsite] = useState(contact?.socials?.website ?? '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const socials: DbContact['socials'] = {}
    if (whatsapp.trim()) socials.whatsapp = whatsapp.trim()
    if (instagram.trim()) socials.instagram = instagram.trim()
    if (linkedin.trim()) socials.linkedin = linkedin.trim()
    if (twitter.trim()) socials.twitter = twitter.trim()
    if (website.trim()) socials.website = website.trim()

    onSave({
      name: name.trim(),
      nickname: nickname.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      relationship,
      company: company.trim() || null,
      job_title: jobTitle.trim() || null,
      tags,
      socials,
      address: address.trim() || null,
      notes: notes.trim() || null,
    })
  }

  const inputClass =
    'w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]'
  const labelClass = 'block text-xs font-medium text-[var(--color-text-secondary)] mb-1'

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
      <div
        className="w-full max-w-md max-h-[85vh] flex flex-col rounded-[var(--radius-lg)] border overflow-hidden"
        style={{
          background: 'var(--color-bg-elevated)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b shrink-0"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
            {contact ? 'Edit contact' : 'New contact'}
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-bg-tertiary)]"
          >
            <X size={14} className="text-[var(--color-text-tertiary)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Name + Nickname */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoFocus
                className={inputClass}
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
            <div>
              <label className={labelClass}>Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Nickname"
                className={inputClass}
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className={inputClass}
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className={inputClass}
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
          </div>

          {/* Relationship */}
          <div>
            <label className={labelClass}>Relationship</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as ContactRelationship)}
              className={inputClass}
              style={{ borderColor: 'var(--color-border)' }}
            >
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Company + Job title */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
                className={inputClass}
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
            <div>
              <label className={labelClass}>Job title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Title / role"
                className={inputClass}
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
          </div>

          {/* Socials (expandable) */}
          <div>
            <button
              type="button"
              onClick={() => setShowSocials(!showSocials)}
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <ChevronDown
                size={12}
                className={showSocials ? 'rotate-180' : ''}
                style={{ transition: 'transform 150ms' }}
              />
              Social links
            </button>
            {showSocials && (
              <div className="mt-2 space-y-3">
                <div>
                  <label className={labelClass}>WhatsApp</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className={inputClass}
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
                <div>
                  <label className={labelClass}>Instagram</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@username"
                    className={inputClass}
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="linkedin.com/in/username"
                    className={inputClass}
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
                <div>
                  <label className={labelClass}>Twitter</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@handle"
                    className={inputClass}
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
                <div>
                  <label className={labelClass}>Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className={inputClass}
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="vip, cabo, tech"
              className={inputClass}
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* Address */}
          <div>
            <label className={labelClass}>Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, state..."
              rows={2}
              className={inputClass + ' resize-none'}
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
              className={inputClass + ' resize-none'}
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] border text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)] transition-colors disabled:opacity-40"
              style={{ background: 'var(--color-accent)' }}
            >
              {contact ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
