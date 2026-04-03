import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Clock,
  Car,
  Check,
  LayoutGrid,
} from 'lucide-react'
import { MOCK_VENUES } from './venues-data'

export function VenueDetail() {
  const { venueId } = useParams<{ venueId: string }>()
  const navigate = useNavigate()

  const venue = MOCK_VENUES.find((v) => v.id === venueId)

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <Building2 size={32} className="text-[var(--color-text-tertiary)]" />
        <p className="text-sm text-[var(--color-text-tertiary)]">Venue no encontrado</p>
        <button
          onClick={() => navigate('/')}
          className="text-xs text-[var(--color-accent)] hover:underline"
        >
          Volver a venues
        </button>
      </div>
    )
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
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {venue.name}
            </h1>
            <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-tertiary)]">
              <span className="flex items-center gap-1">
                <MapPin size={10} />
                {venue.location}
              </span>
              <span className="flex items-center gap-1">
                <Users size={10} />
                {venue.maxCapacity} max
              </span>
              {venue.curfew && (
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  Curfew: {venue.curfew}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Spaces */}
        <section>
          <h2
            className="text-xs font-semibold mb-3 flex items-center gap-1.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <LayoutGrid size={13} />
            Espacios
          </h2>
          <div className="space-y-2">
            {venue.spaces.map((space) => (
              <div
                key={space.name}
                className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                }}
              >
                <div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {space.name}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    {space.use}
                  </div>
                </div>
                {space.capacity && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: 'var(--color-bg-tertiary)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {space.capacity} pax
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* What venue provides */}
        <section>
          <h2
            className="text-xs font-semibold mb-3 flex items-center gap-1.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Check size={13} />
            El venue provee
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {venue.provides.map((item) => (
              <span
                key={item}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px]"
                style={{
                  background: `${venue.color}10`,
                  color: venue.color,
                  border: `1px solid ${venue.color}25`,
                }}
              >
                <Check size={9} />
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Details */}
        <section>
          <h2
            className="text-xs font-semibold mb-3"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Detalles
          </h2>
          <div className="space-y-2">
            {venue.parking && (
              <div className="flex items-center gap-2 text-[11px]">
                <Car size={12} className="text-[var(--color-text-tertiary)]" />
                <span style={{ color: 'var(--color-text-primary)' }}>{venue.parking}</span>
              </div>
            )}
            {venue.curfew && (
              <div className="flex items-center gap-2 text-[11px]">
                <Clock size={12} className="text-[var(--color-text-tertiary)]" />
                <span style={{ color: 'var(--color-text-primary)' }}>
                  Curfew: {venue.curfew}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Notes */}
        {venue.notes && (
          <section>
            <h2
              className="text-xs font-semibold mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Notas
            </h2>
            <p
              className="text-[11px] leading-relaxed"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {venue.notes}
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
