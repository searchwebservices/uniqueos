import { Sun } from 'lucide-react'
import type { WidgetProps } from '@/types/os'

export function WeatherWidget({ config }: WidgetProps) {
  const city = (config?.city as string) || 'San Diego'

  return (
    <div className="flex items-center justify-between h-full px-1">
      <div className="flex flex-col gap-0.5">
        <span
          className="text-2xl font-medium"
          style={{ color: 'var(--color-text-primary)' }}
        >
          72 F
        </span>
        <span
          className="text-xs"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {city}
        </span>
        <span
          className="text-[10px]"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Sunny
        </span>
      </div>

      <div
        className="w-12 h-12 flex items-center justify-center rounded-full"
        style={{ background: 'var(--color-accent-subtle)' }}
      >
        <Sun size={24} style={{ color: 'var(--color-accent)' }} />
      </div>
    </div>
  )
}
