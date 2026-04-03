import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Users,
  Palette,
  Truck,
  Mail,
  FileText,
  Calendar,
  LayoutGrid,
  MapPin,
  Camera,
  Heart,
  Package,
  Building2,
} from 'lucide-react'
import { useWindowStore } from '@/stores/window-store'
import { MOCK_COUPLES } from './couples-data'

interface HubCard {
  id: string
  label: string
  icon: typeof Clock
  color: string
  description: string
  /** Which app to open, or null for in-app action */
  appId?: string
  meta?: Record<string, unknown>
}

function buildCards(coupleId: string): HubCard[] {
  return [
    {
      id: 'timeline',
      label: 'Timeline',
      icon: Clock,
      color: '#4a6fa5',
      description: 'Cronograma del día de la boda',
      appId: 'wedding-timeline',
      meta: { coupleId },
    },
    {
      id: 'budget',
      label: 'Presupuesto',
      icon: DollarSign,
      color: '#4a7c59',
      description: 'Cotización y pagos',
      appId: 'quotes',
      meta: { coupleId },
    },
    {
      id: 'guests',
      label: 'Invitados',
      icon: Users,
      color: '#7c5cbf',
      description: 'Lista de invitados y RSVPs',
    },
    {
      id: 'vendors',
      label: 'Proveedores',
      icon: Truck,
      color: '#c4841d',
      description: 'Proveedores asignados y contratos',
      appId: 'vendors',
      meta: { coupleId },
    },
    {
      id: 'venue',
      label: 'Venue',
      icon: Building2,
      color: '#667eea',
      description: 'Detalles del lugar de la boda',
      appId: 'venues',
      meta: { coupleId },
    },
    {
      id: 'inventory',
      label: 'Inventario',
      icon: Package,
      color: '#8a6d3b',
      description: 'Items de renta y decoración',
      appId: 'inventory',
      meta: { coupleId },
    },
    {
      id: 'design',
      label: 'Diseño & Decor',
      icon: Palette,
      color: '#c4473a',
      description: 'Lookbook, colores y decoración',
    },
    {
      id: 'emails',
      label: 'Correos',
      icon: Mail,
      color: '#4a6fa5',
      description: 'Historial de comunicación',
      appId: 'email',
      meta: { coupleId },
    },
    {
      id: 'documents',
      label: 'Documentos',
      icon: FileText,
      color: '#8a6d3b',
      description: 'Contratos, facturas y archivos',
      appId: 'drive',
      meta: { coupleId },
    },
    {
      id: 'calendar',
      label: 'Calendario',
      icon: Calendar,
      color: '#3a8a8a',
      description: 'Fechas clave y citas',
      appId: 'calendar',
      meta: { coupleId },
    },
    {
      id: 'seating',
      label: 'Mesas',
      icon: LayoutGrid,
      color: '#b87a4b',
      description: 'Layout de mesas y asientos',
    },
    {
      id: 'photos',
      label: 'Fotos',
      icon: Camera,
      color: '#6366f1',
      description: 'Galería e inspiración',
    },
  ]
}

const PHASE_LABELS: Record<number, string> = {
  1: 'Onboarding',
  2: 'Vendor Booking',
  3: 'Design & Decor',
  4: 'Confirmations',
  5: 'Final Prep',
}

export function CoupleHub() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const openWindow = useWindowStore((s) => s.openWindow)

  const couple = MOCK_COUPLES.find((c) => c.id === id)

  if (!couple) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <Heart size={32} className="text-[var(--color-text-tertiary)]" />
        <p className="text-sm text-[var(--color-text-tertiary)]">Pareja no encontrada</p>
        <button
          onClick={() => navigate('/')}
          className="text-xs text-[var(--color-accent)] hover:underline"
        >
          Volver a parejas
        </button>
      </div>
    )
  }

  const cards = buildCards(couple.id)

  const handleCardClick = (card: HubCard) => {
    if (card.appId) {
      openWindow(card.appId, card.meta)
    }
    // Cards without appId are placeholders — no action yet
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-elevated)]">
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-4 pb-4 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate('/')}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <ArrowLeft size={16} className="text-[var(--color-text-secondary)]" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)] truncate">
              {couple.names}
            </h1>
            <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-tertiary)]">
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {couple.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={10} />
                {couple.venue}
              </span>
              <span className="flex items-center gap-1">
                <Users size={10} />
                {couple.guests} pax
              </span>
            </div>
          </div>
        </div>

        {/* Phase indicator */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 flex-1">
            {[1, 2, 3, 4, 5].map((p) => (
              <div
                key={p}
                className="h-1.5 flex-1 rounded-full"
                style={{
                  background:
                    p <= couple.phase
                      ? `var(--color-phase-${p})`
                      : 'var(--color-bg-tertiary)',
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
            Fase {couple.phase}: {PHASE_LABELS[couple.phase] ?? couple.phaseLabel}
          </span>
        </div>
      </div>

      {/* Card grid */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          {cards.map((card) => {
            const Icon = card.icon
            const isPlaceholder = !card.appId

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-[var(--radius-lg)] border text-center transition-all hover:shadow-sm active:scale-[0.98]"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-bg-elevated)',
                  opacity: isPlaceholder ? 0.6 : 1,
                  cursor: isPlaceholder ? 'default' : 'pointer',
                }}
              >
                <div
                  className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-lg)] transition-transform group-hover:scale-105"
                  style={{
                    background: `${card.color}15`,
                    border: `1px solid ${card.color}30`,
                  }}
                >
                  <Icon size={22} style={{ color: card.color }} />
                </div>
                <div>
                  <div
                    className="text-xs font-semibold mb-0.5"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {card.label}
                  </div>
                  <div
                    className="text-[10px] leading-tight"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {card.description}
                  </div>
                </div>
                {isPlaceholder && (
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full"
                    style={{
                      background: 'var(--color-bg-tertiary)',
                      color: 'var(--color-text-tertiary)',
                    }}
                  >
                    Pronto
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
