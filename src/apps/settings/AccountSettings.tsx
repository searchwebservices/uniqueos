import { useState, useRef, type FormEvent } from 'react'
import { Upload } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useUserProfile } from '@/hooks/useUserProfile'
import { supabase } from '@/lib/supabase'

export function AccountSettings() {
  const { user } = useAuth()
  const { profile, updateProfile, uploadAvatar } = useUserProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState(
    profile?.display_name ?? user.email?.split('@')[0] ?? '',
  )
  const [nameEdited, setNameEdited] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')

  function handleNameSave() {
    if (!displayName.trim()) return
    updateProfile.mutate({ display_name: displayName.trim() })
    setNameEdited(false)
  }

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      uploadAvatar.mutate(file)
    }
  }

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters')
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      setPasswordMsg(error.message)
    } else {
      setPasswordMsg('Password updated')
      setNewPassword('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <section>
        <h3 className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">
          Profile picture
        </h3>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center overflow-hidden border"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium text-[var(--color-text-tertiary)]">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatar.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-[var(--radius-md)] border text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors disabled:opacity-50"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <Upload size={12} />
              {uploadAvatar.isPending ? 'Uploading...' : 'Upload photo'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>
      </section>

      {/* Display name */}
      <section>
        <h3 className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">
          Display name
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value)
              setNameEdited(true)
            }}
            className="flex-1 px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
          {nameEdited && (
            <button
              onClick={handleNameSave}
              disabled={updateProfile.isPending}
              className="px-3 py-2 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)] transition-colors disabled:opacity-50"
              style={{ background: 'var(--color-accent)' }}
            >
              Save
            </button>
          )}
        </div>
      </section>

      {/* Email */}
      <section>
        <h3 className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">
          Email
        </h3>
        <p className="text-sm text-[var(--color-text-primary)]">
          {user.email}
        </p>
      </section>

      {/* Password */}
      <section>
        <h3 className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">
          Change password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-sm">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <button
            type="submit"
            disabled={!newPassword}
            className="px-4 py-2 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)] transition-colors disabled:opacity-40"
            style={{ background: 'var(--color-accent)' }}
          >
            Update password
          </button>
          {passwordMsg && (
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {passwordMsg}
            </p>
          )}
        </form>
      </section>
    </div>
  )
}
