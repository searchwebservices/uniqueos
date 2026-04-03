import { useAIUsage } from './hooks'

export function UsageIndicator() {
  const { used, remaining, limit, isLoading } = useAIUsage()

  if (isLoading) return null

  const percentage = (used / limit) * 100

  return (
    <div className="px-3 py-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
          {remaining}/{limit} messages remaining today
        </span>
      </div>
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: 'var(--color-bg-tertiary)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(100, percentage)}%`,
            background: percentage > 80 ? '#ef4444' : 'var(--color-accent)',
          }}
        />
      </div>
    </div>
  )
}
