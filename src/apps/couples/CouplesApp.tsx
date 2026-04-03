import { useState } from 'react'
import { Search, Plus, ChevronRight, MapPin, Users, Calendar } from 'lucide-react'
import { useWindowStore } from '@/stores/window-store'

interface Couple {
  id: string
  names: string
  date: string
  venue: string
  guests: number
  phase: number
  phaseLabel: string
  progress: number
  status: 'active' | 'completed' | 'upcoming'
  colors: string
  email: string
}

const MOCK_COUPLES: Couple[] = [
  {
    id: '1', names: 'Maggie & Carson', date: 'Mar 26, 2026',
    venue: 'Corazon Cabo', guests: 59, phase: 5, phaseLabel: 'Final Prep',
    progress: 92, status: 'active', colors: 'White, ivory & greenery',
    email: 'maggie@email.com',
  },
  {
    id: '2', names: 'Ally & Mark', date: 'Feb 28, 2026',
    venue: "Petunia's", guests: 36, phase: 5, phaseLabel: 'Final Prep',
    progress: 100, status: 'completed', colors: 'Pink & gold',
    email: 'aliebava@yahoo.com',
  },
  {
    id: '3', names: 'Sofia & James', date: 'Jun 14, 2026',
    venue: 'Corazon Cabo', guests: 85, phase: 3, phaseLabel: 'Design & Decor',
    progress: 55, status: 'active', colors: 'Dusty rose & sage',
    email: 'sofia@email.com',
  },
  {
    id: '4', names: 'Emma & Diego', date: 'Aug 22, 2026',
    venue: 'Esperanza', guests: 120, phase: 2, phaseLabel: 'Vendor Booking',
    progress: 30, status: 'active', colors: 'Navy & gold',
    email: 'emma@email.com',
  },
  {
    id: '5', names: 'Rachel & Thomas', date: 'Oct 10, 2026',
    venue: 'Waldorf Astoria', guests: 75, phase: 1, phaseLabel: 'Onboarding',
    progress: 12, status: 'upcoming', colors: 'Terracotta & cream',
    email: 'rachel@email.com',
  },
  {
    id: '6', names: 'Lauren & Chris', date: 'Nov 7, 2026',
    venue: 'Pueblo Bonito', guests: 95, phase: 1, phaseLabel: 'Onboarding',
    progress: 8, status: 'upcoming', colors: 'Burgundy & blush',
    email: 'lauren@email.com',
  },
  {
    id: '7', names: 'Ashley & Ryan', date: 'Dec 20, 2026',
    venue: "Petunia's", guests: 45, phase: 1, phaseLabel: 'Onboarding',
    progress: 5, status: 'upcoming', colors: 'All white',
    email: 'ashley@email.com',
  },
]

const PHASE_COLORS: Record<number, string> = {
  1: '#3a97b8',
  2: '#6BB5CF',
  3: '#1a7a9a',
  4: '#d4956a',
  5: '#b87a4b',
}

function PhaseBar({ phase, progress }: { phase: number; progress: number }) {
  return (
    <div className="flex gap-0.5 w-full">
      {[1, 2, 3, 4, 5].map(p => (
        <div key={p} className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-tertiary)' }}>
          {p < phase && (
            <div className="h-full rounded-full" style={{ width: '100%', background: PHASE_COLORS[p] }} />
          )}
          {p === phase && (
            <div className="h-full rounded-full" style={{ width: `${Math.max(10, (progress % 20) * 5)}%`, background: PHASE_COLORS[p] }} />
          )}
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: Couple['status'] }) {
  const styles = {
    active: { bg: 'rgba(26,122,154,0.1)', color: '#1a7a9a', label: 'Active' },
    completed: { bg: 'rgba(52,168,83,0.1)', color: '#34a853', label: 'Completed' },
    upcoming: { bg: 'rgba(184,122,75,0.1)', color: '#b87a4b', label: 'Upcoming' },
  }
  const s = styles[status]
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

export function CouplesApp() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all')
  const openWindow = useWindowStore(s => s.openWindow)

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
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
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
        <div className="flex gap-4 mb-3">
          {[
            { label: 'Activas', value: stats.active, color: '#1a7a9a' },
            { label: 'Proximas', value: stats.upcoming, color: '#b87a4b' },
            { label: 'Completadas', value: stats.completed, color: '#34a853' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="text-xs text-[var(--color-text-tertiary)]">{s.label}</span>
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>
            <Search size={14} className="text-[var(--color-text-tertiary)]" />
            <input
              type="text" placeholder="Buscar pareja..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
            />
          </div>
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

      {/* Couple List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {filtered.map(couple => (
          <button
            key={couple.id}
            onClick={() => openWindow('wedding-timeline', { coupleId: couple.id })}
            className="w-full text-left p-4 rounded-xl mb-2 border transition-all hover:shadow-sm"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">{couple.names}</span>
                  <StatusBadge status={couple.status} />
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-tertiary)]">
                  <span className="flex items-center gap-1"><Calendar size={11} />{couple.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} />{couple.venue}</span>
                  <span className="flex items-center gap-1"><Users size={11} />{couple.guests} pax</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-[var(--color-text-tertiary)] mt-1" />
            </div>

            <div className="flex items-center gap-3 mt-3">
              <PhaseBar phase={couple.phase} progress={couple.progress} />
              <span className="text-[10px] font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
                Fase {couple.phase}: {couple.phaseLabel}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
