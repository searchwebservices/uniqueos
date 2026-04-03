import { useNavigate } from 'react-router-dom'
import { Building2, MapPin, Users, Plus } from 'lucide-react'
import { MOCK_VENUES } from './venues-data'

export function VenuesHub() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-elevated)]">
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-4 pb-4 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-[var(--color-text-secondary)]" />
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Venues
            </h1>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-accent)] text-[var(--color-text-inverse)]">
            <Plus size={14} />
            Agregar
          </button>
        </div>
        <p className="text-[11px] text-[var(--color-text-tertiary)]">
          {MOCK_VENUES.length} venues registrados en Los Cabos
        </p>
      </div>

      {/* Venue cards */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <p
          className="text-xs font-medium mb-4"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Selecciona un venue
        </p>
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          {MOCK_VENUES.map((venue) => (
            <button
              key={venue.id}
              onClick={() => navigate(`/venue/${venue.id}`)}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-[var(--radius-lg)] border text-center transition-all hover:shadow-sm active:scale-[0.98]"
              style={{
                borderColor: 'var(--color-border)',
                background: 'var(--color-bg-elevated)',
              }}
            >
              <div
                className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-lg)] transition-transform group-hover:scale-105"
                style={{
                  background: `${venue.color}15`,
                  border: `1px solid ${venue.color}30`,
                }}
              >
                <Building2 size={22} style={{ color: venue.color }} />
              </div>
              <div>
                <div
                  className="text-xs font-semibold mb-0.5"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {venue.name}
                </div>
                <div className="flex items-center justify-center gap-1 text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  <MapPin size={9} />
                  {venue.location}
                </div>
              </div>
              <div className="flex gap-2 text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>
                <span className="flex items-center gap-0.5">
                  <Users size={9} />
                  {venue.maxCapacity} max
                </span>
                <span>·</span>
                <span>{venue.spaces.length} espacios</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
