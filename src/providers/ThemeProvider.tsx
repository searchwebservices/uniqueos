import { useEffect, type ReactNode } from 'react'
import { useThemeStore } from '@/stores/theme-store'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore(s => s.mode)

  useEffect(() => {
    const apply = () => {
      const resolved = mode === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : mode
      document.documentElement.setAttribute('data-theme', resolved)
    }

    apply()

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [mode])

  return <>{children}</>
}
