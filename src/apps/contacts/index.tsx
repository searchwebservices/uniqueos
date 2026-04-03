import { useState } from 'react'
import { Plus, User } from 'lucide-react'
import { useContacts } from '@/hooks/useContacts'
import { ContactList } from './ContactList'
import { ContactDetail } from './ContactDetail'
import { ContactForm } from './ContactForm'
import type { DbContact } from '@/types/database'

export default function ContactsApp() {
  const {
    contacts,
    isLoading,
    createContact,
    updateContact,
    deleteContact,
    uploadAvatar,
  } = useContacts()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<DbContact | null>(null)

  const selectedContact = contacts.find((c) => c.id === selectedId) ?? null

  function handleSelect(contact: DbContact) {
    setSelectedId(contact.id)
  }

  function openCreate() {
    setEditingContact(null)
    setShowForm(true)
  }

  function openEdit() {
    if (selectedContact) {
      setEditingContact(selectedContact)
      setShowForm(true)
    }
  }

  function handleSave(
    data: Partial<Omit<DbContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
  ) {
    if (editingContact) {
      updateContact.mutate({ id: editingContact.id, ...data })
    } else {
      createContact.mutate(data, {
        onSuccess: (created) => {
          setSelectedId(created.id)
        },
      })
    }
    setShowForm(false)
    setEditingContact(null)
  }

  function handleDelete(id: string) {
    deleteContact.mutate(id)
    if (selectedId === id) {
      setSelectedId(null)
    }
  }

  function handleToggleFavorite(id: string, favorite: boolean) {
    updateContact.mutate({ id, favorite })
  }

  function handleUploadAvatar(contactId: string, file: File) {
    uploadAvatar.mutate({ contactId, file })
  }

  return (
    <div className="@container flex h-full bg-[var(--color-bg-elevated)]">
      {/* Left sidebar */}
      <div
        className="w-[250px] shrink-0 flex flex-col border-r"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        {/* Sidebar header */}
        <div
          className="flex items-center justify-between px-3 py-2 border-b shrink-0"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <h2 className="text-sm font-medium text-[var(--color-text-primary)]">
            Contacts
          </h2>
          <button
            onClick={openCreate}
            className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            title="Add contact"
          >
            <Plus size={14} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        {/* Contact list */}
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <span className="text-xs text-[var(--color-text-tertiary)]">Loading...</span>
          </div>
        ) : (
          <ContactList
            contacts={contacts}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        )}
      </div>

      {/* Right panel */}
      <div className="flex-1 min-w-0">
        {selectedContact ? (
          <ContactDetail
            contact={selectedContact}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
            onUploadAvatar={handleUploadAvatar}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-bg-tertiary)' }}
            >
              <User size={24} style={{ color: 'var(--color-text-tertiary)' }} />
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              Select a contact to view details
            </p>
            <button
              onClick={openCreate}
              className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)]"
              style={{ background: 'var(--color-accent)' }}
            >
              Add contact
            </button>
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <ContactForm
          contact={editingContact}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false)
            setEditingContact(null)
          }}
        />
      )}
    </div>
  )
}
