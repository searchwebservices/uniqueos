export interface WallpaperPreset {
  id: string
  name: string
  css: string
}

export const wallpaperPresets: WallpaperPreset[] = [
  {
    id: 'default',
    name: 'Default',
    css: 'var(--color-bg-primary)',
  },
  {
    id: 'gradient-sunset',
    name: 'Gradient Sunset',
    css: 'linear-gradient(135deg, #f5af19 0%, #f12711 40%, #a855f7 100%)',
  },
  {
    id: 'gradient-ocean',
    name: 'Gradient Ocean',
    css: 'linear-gradient(135deg, #667eea 0%, #0891b2 50%, #06b6d4 100%)',
  },
  {
    id: 'gradient-forest',
    name: 'Gradient Forest',
    css: 'linear-gradient(135deg, #134e5e 0%, #2d8a6e 50%, #10b981 100%)',
  },
  {
    id: 'mesh',
    name: 'Mesh',
    css: [
      'radial-gradient(at 40% 20%, #b87a4b33 0px, transparent 50%)',
      'radial-gradient(at 80% 0%, #f5af1933 0px, transparent 50%)',
      'radial-gradient(at 0% 50%, #d4956a33 0px, transparent 50%)',
      'radial-gradient(at 80% 50%, #a855f733 0px, transparent 50%)',
      'radial-gradient(at 0% 100%, #06b6d433 0px, transparent 50%)',
      'var(--color-bg-primary)',
    ].join(', '),
  },
  {
    id: 'dots',
    name: 'Dots',
    css: 'radial-gradient(circle, var(--color-border) 1px, transparent 1px), var(--color-bg-primary)',
  },
  {
    id: 'lines',
    name: 'Lines',
    css: 'repeating-linear-gradient(0deg, transparent, transparent 39px, var(--color-border-subtle) 39px, var(--color-border-subtle) 40px), var(--color-bg-primary)',
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
