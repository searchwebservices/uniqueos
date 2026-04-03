import { useNavigate } from 'react-router-dom'
import {
  Truck,
  Camera,
  Music,
  Flower2,
  Sparkles,
  Armchair,
  UtensilsCrossed,
  Car,
  MoreHorizontal,
} from 'lucide-react'
import { VENDOR_CATEGORIES, MOCK_VENDORS } from './vendors-data'
import type { LucideIcon } from 'lucide-react'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  photography: Camera,
  music: Music,
  florals: Flower2,
  hair_makeup: Sparkles,
  rentals: Armchair,
  catering: UtensilsCrossed,
  transport: Car,
  other: MoreHorizontal,
}

export function VendorsHub() {
  const navigate = useNavigate()

  const totalVendors = MOCK_VENDORS.length

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-elevated)]">
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-4 pb-4 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Truck size={18} className="text-[var(--color-text-secondary)]" />
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Proveedores
          </h1>
        </div>
        <div className="flex gap-4 text-[11px] text-[var(--color-text-tertiary)]">
          <span>
            <strong className="text-[var(--color-text-primary)]">{totalVendors}</strong> proveedores
          </span>
          <span>
            <strong className="text-[var(--color-text-primary)]">
              {VENDOR_CATEGORIES.length}
            </strong>{' '}
            categorías
          </span>
        </div>
      </div>

      {/* Category cards */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <p
          className="text-xs font-medium mb-4"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Selecciona un tipo de proveedor
        </p>
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          {VENDOR_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] ?? Truck
            const count = MOCK_VENDORS.filter((v) => v.category === cat.id).length

            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-[var(--radius-lg)] border text-center transition-all hover:shadow-sm active:scale-[0.98]"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-bg-elevated)',
                }}
              >
                <div
                  className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-lg)] transition-transform group-hover:scale-105"
                  style={{
                    background: `${cat.color}15`,
                    border: `1px solid ${cat.color}30`,
                  }}
                >
                  <Icon size={22} style={{ color: cat.color }} />
                </div>
                <div>
                  <div
                    className="text-xs font-semibold mb-0.5"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {cat.label}
                  </div>
                  <div
                    className="text-[10px] leading-tight"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {cat.description}
                  </div>
                </div>
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full"
                  style={{
                    background: count > 0 ? `${cat.color}15` : 'var(--color-bg-tertiary)',
                    color: count > 0 ? cat.color : 'var(--color-text-tertiary)',
                  }}
                >
                  {count} {count === 1 ? 'proveedor' : 'proveedores'}
                </span>
              </button>
            )
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-5">
          <button
            onClick={() => navigate('/category/all')}
            className="text-[11px] font-medium hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            Ver todos los proveedores
          </button>
        </div>
      </div>
    </div>
  )
}
