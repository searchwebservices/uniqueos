import { useState } from 'react'
import { Palette, PanelBottom, User, Plug } from 'lucide-react'
import { AppearanceSettings } from './AppearanceSettings'
import { DockSettings } from './DockSettings'
import { AccountSettings } from './AccountSettings'
import { cn } from '@/lib/cn'

type SettingsSection = 'appearance' | 'dock' | 'account' | 'integrations'

const NAV_ITEMS: {
  id: SettingsSection
  label: string
  Icon: typeof Palette
  disabled?: boolean
}[] = [
  { id: 'appearance', label: 'Appearance', Icon: Palette },
  { id: 'dock', label: 'Dock', Icon: PanelBottom },
  { id: 'account', label: 'Account', Icon: User },
  { id: 'integrations', label: 'Integrations', Icon: Plug, disabled: true },
]

export function SettingsApp() {
  const [section, setSection] = useState<SettingsSection>('appearance')

  return (
    <div className="flex h-full bg-[var(--color-bg-elevated)]">
      {/* Sidebar */}
      <div
        className="w-48 shrink-0 border-r py-3"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <nav className="space-y-0.5 px-2">
          {NAV_ITEMS.map(({ id, label, Icon, disabled }) => (
            <button
              key={id}
              onClick={() => !disabled && setSection(id)}
              disabled={disabled}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors text-left',
                section === id
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-medium'
                  : disabled
                    ? 'text-[var(--color-text-tertiary)] cursor-not-allowed'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]',
              )}
            >
              <Icon size={14} />
              {label}
              {disabled && (
                <span className="text-[9px] ml-auto opacity-50">Soon</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-base font-medium text-[var(--color-text-primary)] mb-5">
          {NAV_ITEMS.find((n) => n.id === section)?.label}
        </h2>

        {section === 'appearance' && <AppearanceSettings />}
        {section === 'dock' && <DockSettings />}
        {section === 'account' && <AccountSettings />}
        {section === 'integrations' && (
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Integrations coming in a future update.
          </p>
        )}
      </div>
    </div>
  )
}
