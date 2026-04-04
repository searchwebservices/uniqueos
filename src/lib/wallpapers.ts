export type WallpaperTone = 'light' | 'dark' | 'auto'

export interface WallpaperPreset {
  id: string
  name: string
  css: string
  tone: WallpaperTone
}

export const wallpaperPresets: WallpaperPreset[] = [
  // ===== DEFAULTS =====
  {
    id: 'default',
    name: 'Default',
    css: 'var(--color-bg-primary)',
    tone: 'auto',
  },

  // ===== GRADIENTS =====
  {
    id: 'gradient-sunset',
    name: 'Sunset',
    css: 'linear-gradient(135deg, #d4956a 0%, #c4473a 50%, #8b2a4a 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean',
    css: 'linear-gradient(135deg, #1a7a9a 0%, #2d6a8f 50%, #1b4965 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-forest',
    name: 'Forest',
    css: 'linear-gradient(135deg, #2d5a27 0%, #3a7a4e 50%, #1b4332 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-dusk',
    name: 'Dusk',
    css: 'linear-gradient(135deg, #4a3f6b 0%, #6b4c7a 50%, #3d2b56 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-sand',
    name: 'Sand',
    css: 'linear-gradient(135deg, #c9a96e 0%, #b08d57 50%, #8a6d3b 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-rose',
    name: 'Rose',
    css: 'linear-gradient(135deg, #c4787a 0%, #b05a6a 50%, #8a3a4a 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-aurora',
    name: 'Aurora',
    css: 'linear-gradient(135deg, #1a7a9a 0%, #4a6b8a 40%, #6b4c7a 70%, #8a3a5a 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-slate',
    name: 'Slate',
    css: 'linear-gradient(135deg, #4a5568 0%, #5a6577 50%, #3d4a5c 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-ember',
    name: 'Ember',
    css: 'linear-gradient(135deg, #b87a4b 0%, #c4643a 50%, #8a3a2a 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-midnight',
    name: 'Midnight',
    css: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-copper',
    name: 'Copper',
    css: 'linear-gradient(135deg, #b87a4b 0%, #a0694a 50%, #7a5035 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-lagoon',
    name: 'Lagoon',
    css: 'linear-gradient(160deg, #0d4f5a 0%, #1a7a7a 40%, #3a97a0 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-terracotta',
    name: 'Terracotta',
    css: 'linear-gradient(135deg, #c4784b 0%, #a85a3a 50%, #7a3d28 100%)',
    tone: 'dark',
  },
  {
    id: 'gradient-cool-gray',
    name: 'Cool gray',
    css: 'linear-gradient(135deg, #6b7b8d 0%, #5a6a7a 50%, #4a5a6a 100%)',
    tone: 'dark',
  },

  // ===== FLAT COLORS =====
  {
    id: 'flat-cream',
    name: 'Cream',
    css: '#f5f0e8',
    tone: 'light',
  },
  {
    id: 'flat-charcoal',
    name: 'Charcoal',
    css: '#2d2a26',
    tone: 'dark',
  },
  {
    id: 'flat-sage',
    name: 'Sage',
    css: '#7a8a6e',
    tone: 'dark',
  },
  {
    id: 'flat-dusty-rose',
    name: 'Dusty rose',
    css: '#b08a8a',
    tone: 'dark',
  },
  {
    id: 'flat-ocean',
    name: 'Ocean blue',
    css: '#1a6a7a',
    tone: 'dark',
  },
  {
    id: 'flat-warm-gray',
    name: 'Warm gray',
    css: '#8a8078',
    tone: 'dark',
  },
  {
    id: 'flat-clay',
    name: 'Clay',
    css: '#a07a60',
    tone: 'dark',
  },
  {
    id: 'flat-slate',
    name: 'Slate blue',
    css: '#4a5a6a',
    tone: 'dark',
  },
  {
    id: 'flat-espresso',
    name: 'Espresso',
    css: '#3a2a1e',
    tone: 'dark',
  },
  {
    id: 'flat-sand',
    name: 'Sand',
    css: '#c8b898',
    tone: 'light',
  },

  // ===== TEXTURES & PATTERNS (CSS-only) =====
  {
    id: 'mesh',
    name: 'Mesh warm',
    css: [
      'radial-gradient(at 40% 20%, #b87a4b33 0px, transparent 50%)',
      'radial-gradient(at 80% 0%, #f5af1933 0px, transparent 50%)',
      'radial-gradient(at 0% 50%, #d4956a33 0px, transparent 50%)',
      'radial-gradient(at 80% 50%, #a855f733 0px, transparent 50%)',
      'radial-gradient(at 0% 100%, #06b6d433 0px, transparent 50%)',
      'var(--color-bg-primary)',
    ].join(', '),
    tone: 'auto',
  },
  {
    id: 'mesh-ocean',
    name: 'Mesh ocean',
    css: [
      'radial-gradient(at 30% 20%, #1a7a9a44 0px, transparent 50%)',
      'radial-gradient(at 70% 10%, #3a97b844 0px, transparent 50%)',
      'radial-gradient(at 20% 60%, #0d4f5a33 0px, transparent 50%)',
      'radial-gradient(at 80% 70%, #2d6a8f33 0px, transparent 50%)',
      'radial-gradient(at 50% 90%, #1b496533 0px, transparent 50%)',
      'var(--color-bg-primary)',
    ].join(', '),
    tone: 'auto',
  },
  {
    id: 'mesh-rose',
    name: 'Mesh rose',
    css: [
      'radial-gradient(at 25% 15%, #c4787a33 0px, transparent 50%)',
      'radial-gradient(at 75% 25%, #b05a6a33 0px, transparent 50%)',
      'radial-gradient(at 50% 60%, #d4956a22 0px, transparent 50%)',
      'radial-gradient(at 10% 80%, #8a3a4a22 0px, transparent 50%)',
      'var(--color-bg-primary)',
    ].join(', '),
    tone: 'auto',
  },
  {
    id: 'dots',
    name: 'Dots',
    css: 'radial-gradient(circle, var(--color-border) 1px, transparent 1px), var(--color-bg-primary)',
    tone: 'auto',
  },
  {
    id: 'grid',
    name: 'Grid',
    css: [
      'repeating-linear-gradient(0deg, transparent, transparent 39px, var(--color-border-subtle) 39px, var(--color-border-subtle) 40px)',
      'repeating-linear-gradient(90deg, transparent, transparent 39px, var(--color-border-subtle) 39px, var(--color-border-subtle) 40px)',
      'var(--color-bg-primary)',
    ].join(', '),
    tone: 'auto',
  },
  {
    id: 'lines',
    name: 'Lines',
    css: 'repeating-linear-gradient(0deg, transparent, transparent 39px, var(--color-border-subtle) 39px, var(--color-border-subtle) 40px), var(--color-bg-primary)',
    tone: 'auto',
  },
  {
    id: 'diagonal',
    name: 'Diagonal',
    css: 'repeating-linear-gradient(45deg, transparent, transparent 19px, var(--color-border-subtle) 19px, var(--color-border-subtle) 20px), var(--color-bg-primary)',
    tone: 'auto',
  },
  {
    id: 'crosshatch',
    name: 'Crosshatch',
    css: [
      'repeating-linear-gradient(45deg, transparent, transparent 9px, var(--color-border-subtle) 9px, var(--color-border-subtle) 10px)',
      'repeating-linear-gradient(-45deg, transparent, transparent 9px, var(--color-border-subtle) 9px, var(--color-border-subtle) 10px)',
      'var(--color-bg-primary)',
    ].join(', '),
    tone: 'auto',
  },
]

/**
 * Resolve a wallpaper value to a CSS background string.
 * If it matches a preset ID, return the preset CSS.
 * If it looks like a URL, return url(...) wrapped.
 * Otherwise treat as raw CSS.
 */
export function resolveWallpaper(value: string): { background: string; backgroundSize?: string } {
  const preset = wallpaperPresets.find(p => p.id === value)
  if (preset) {
    if (preset.id === 'dots') {
      return { background: preset.css, backgroundSize: '24px 24px' }
    }
    if (preset.id === 'grid') {
      return { background: preset.css, backgroundSize: '40px 40px, 40px 40px' }
    }
    return { background: preset.css }
  }

  // URL-based wallpaper (from Supabase Storage)
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
    return {
      background: `url(${value}) center/cover no-repeat, var(--color-bg-primary)`,
    }
  }

  // Raw CSS fallback
  return { background: value }
}

/**
 * Determine the effective tone of a wallpaper for text contrast.
 * - 'light' wallpapers need dark text
 * - 'dark' wallpapers need light text
 * - 'auto' wallpapers follow the current theme mode
 */
export function getWallpaperTone(wallpaperId: string): WallpaperTone {
  const preset = wallpaperPresets.find(p => p.id === wallpaperId)
  return preset?.tone ?? 'auto'
}
