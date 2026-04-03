import { useThemeStore } from '@/stores/theme-store'
import { useUserSettings } from '@/hooks/useUserSettings'
import { Monitor, Moon, Sun } from 'lucide-react'
import type { ThemeMode } from '@/types/os'
import { cn } from '@/lib/cn'
import { wallpaperPresets, type WallpaperPreset } from '@/lib/wallpapers'

function groupWallpapers(): { label: string; presets: WallpaperPreset[] }[] {
  const groups: { label: string; presets: WallpaperPreset[] }[] = [
    { label: 'Gradients', presets: [] },
    { label: 'Flat colors', presets: [] },
    { label: 'Textures', presets: [] },
  ]
  for (const wp of wallpaperPresets) {
    if (wp.id === 'default') groups[0].presets.unshift(wp)
    else if (wp.id.startsWith('gradient-')) groups[0].presets.push(wp)
    else if (wp.id.startsWith('flat-')) groups[1].presets.push(wp)
    else groups[2].presets.push(wp)
  }
  return groups
}

const WALLPAPER_GROUPS = groupWallpapers()

function wallpaperBgSize(id: string): string | undefined {
  if (id === 'dots') return '24px 24px'
  if (id === 'grid') return '40px 40px, 40px 40px'
  return undefined
}

const THEME_OPTIONS: { value: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
]

const ACCENT_PRESETS = [
  '#b87a4b',
  '#4a7c59',
  '#4a6fa5',
  '#c4841d',
  '#c4473a',
  '#7c5cbf',
  '#3a8a8a',
  '#8a6d3b',
]

export function AppearanceSettings() {
  const mode = useThemeStore((s) => s.mode)
  const wallpaper = useThemeStore((s) => s.wallpaper)
  const accentColor = useThemeStore((s) => s.accentColor)
  const setMode = useThemeStore((s) => s.setMode)
  const setWallpaper = useThemeStore((s) => s.setWallpaper)
  const setAccentColor = useThemeStore((s) => s.setAccentColor)
  const { updateSettings } = useUserSettings()

  function handleThemeChange(newMode: ThemeMode) {
    setMode(newMode)
    updateSettings.mutate({ theme: newMode })
  }

  function handleWallpaperChange(wp: string) {
    setWallpaper(wp)
    updateSettings.mutate({ wallpaper: wp })
  }

  function handleAccentChange(color: string) {
    setAccentColor(color)
    updateSettings.mutate({ accent_color: color })
  }

  return (
    <div className="space-y-6">
      {/* Theme */}
      <section>
        <h3 className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">
          Theme
        </h3>
        <div className="flex gap-2">
          {THEME_OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => handleThemeChange(value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] border text-sm transition-colors',
                mode === value
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                  : 'border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]',
              )}
            >
              <Icon
                size={14}
                className={
                  mode === value
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-tertiary)]'
                }
              />
              <span
                className={
                  mode === value
                    ? 'text-[var(--color-accent)] font-medium'
                    : 'text-[var(--color-text-secondary)]'
                }
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Wallpaper */}
      <section className="space-y-4">
        <h3 className="text-xs font-medium text-[var(--color-text-secondary)]">
          Wallpaper
        </h3>
        {WALLPAPER_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
              {group.label}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {group.presets.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => handleWallpaperChange(wp.id)}
                  className={cn(
                    'aspect-video rounded-[var(--radius-md)] border-2 transition-all',
                    wallpaper === wp.id
                      ? 'border-[var(--color-accent)] scale-[1.02]'
                      : 'border-transparent hover:border-[var(--color-border)]',
                  )}
                  style={{
                    background: wp.css,
                    backgroundSize: wallpaperBgSize(wp.id),
                  }}
                  title={wp.name}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Accent color */}
      <section>
        <h3 className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">
          Accent color
        </h3>
        <div className="flex gap-3">
          {ACCENT_PRESETS.map((color) => (
            <button
              key={color}
              onClick={() => handleAccentChange(color)}
              className="w-7 h-7 rounded-full transition-transform"
              style={{
                background: color,
                outline:
                  accentColor === color
                    ? `2px solid ${color}`
                    : '2px solid transparent',
                outlineOffset: '2px',
                transform: accentColor === color ? 'scale(1.15)' : 'scale(1)',
              }}
              title={color}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

