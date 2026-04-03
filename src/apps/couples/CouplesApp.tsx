import { useState } from 'react'
import { Search, Plus, MapPin, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MOCK_COUPLES, type Couple } from './couples-data'

const PHASE_COLORS: Record<number, string> = {
  1: 'var(--color-phase-1)',
  2: 'var(--color-phase-2)',
  3: 'var(--color-phase-3)',
  4: 'var(--color-phase-4)',
  5: 'var(--color-phase-5)',
}

function PhaseBar({ progress }: { phase: number; progress: number }) {
  return (
    <div className="flex gap-0.5 w-full">
      {[1, 2, 3, 4, 5].map(p => {
        const phaseStart = (p - 1) * 20
        const phaseEnd = p * 20
        let fill = 0
        if (progress >= phaseEnd) {
          fill = 100
        } else if (progress > phaseStart) {
          fill = Math.max(10, ((progress - phaseStart) / 20) * 100)
        }
        return (
          <div key={p} className="h-2 flex-1 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-tertiary)' }}>
            {fill > 0 && (
              <div className="h-full rounded-full transition-all duration-200" style={{ width: `${fill}%`, background: PHASE_COLORS[p] }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StatusBadge({ status }: { status: Couple['status'] }) {
  const styles = {
    active: { bg: 'var(--color-ocean-subtle)', color: 'var(--color-ocean)', label: 'Activa' },
    completed: { bg: 'rgba(74,124,89,0.1)', color: 'var(--color-success)', label: 'Completada' },
    upcoming: { bg: 'var(--color-accent-subtle)', color: 'var(--color-accent)', label: 'Proxima' },
  }
  const s = styles[status]
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

export function CouplesApp() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all')
  const navigate = useNavigate()

  const filtered = MOCK_COUPLES.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false
    if (search && !c.names.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const stats = {
    active: MOCK_COUPLES.filter(c => c.status === 'active').length,
    upcoming: MOCK_COUPLES.filter(c => c.status === 'upcoming').length,
    completed: MOCK_COUPLES.filter(c => c.status === 'completed').length,
  }

  return (
    <div className="app-container flex flex-col h-full bg-[var(--color-bg-elevated)]">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Parejas</h1>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-accent)] text-[var(--color-text-inverse)] hover:opacity-90 transition-opacity">
            <Plus size={14} />
            Nueva Pareja
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
          {[
            { label: 'Activas', value: stats.active, color: 'var(--color-ocean)' },
            { label: 'Proximas', value: stats.upcoming, color: 'var(--color-accent)' },
            { label: 'Completadas', value: stats.completed, color: 'var(--color-success)' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="text-xs text-[var(--color-text-tertiary)]">{s.label}</span>
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="space-y-2">
          <div className="search-container flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_2px_var(--color-accent-subtle)]" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>
            <Search size={14} className="text-[var(--color-text-tertiary)]" />
            <input
              type="text" placeholder="Buscar pareja..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:outline-none"
            />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'active', 'upcoming', 'completed'] as const).map(f => (
              <button
                key={f} onClick={() => setFilter(f)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                style={{
                  background: filter === f ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                  color: filter === f ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                }}
              >
                {f === 'all' ? 'Todas' : f === 'active' ? 'Activas' : f === 'upcoming' ? 'Proximas' : 'Completadas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Couple Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
          {filtered.map(couple => (
            <button
              key={couple.id}
              onClick={() => navigate(`/couple/${couple.id}`)}
              className="text-left rounded-xl border overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 group"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}
            >
              {/* Color banner top */}
              <div
                className="h-2 w-full"
                style={{ background: PHASE_COLORS[couple.phase] ?? 'var(--color-accent)' }}
              />

              <div className="p-3.5">
                {/* Date — primary headline */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {couple.date}
                  </span>
                  <StatusBadge status={couple.status} />
                </div>

                {/* Names — subheadline */}
                <h3 className="text-xs text-[var(--color-text-secondary)] font-medium mb-3">
                  {couple.names}
                </h3>

                {/* Venue + Guests */}
                <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-tertiary)] mb-3">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin size={10} className="shrink-0" />
                    {couple.venue}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Users size={10} />
                    {couple.guests}
                  </span>
                </div>

                {/* Phase progress */}
                <PhaseBar phase={couple.phase} progress={couple.progress} />
                <span className="block mt-1.5 text-[9px] font-medium text-[var(--color-text-tertiary)]">
                  Fase {couple.phase}: {couple.phaseLabel}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
