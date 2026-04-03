import { useNavigate } from 'react-router-dom'
import {
  Package,
  Shirt,
  UtensilsCrossed,
  Wine,
  CircleDot,
  Flame,
  Fan,
} from 'lucide-react'
import { CATEGORIES, MOCK_INVENTORY, type CategoryInfo } from './inventory-data'
import type { LucideIcon } from 'lucide-react'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Textiles: Shirt,
  Tableware: CircleDot,
  Glassware: Wine,
  Cutlery: UtensilsCrossed,
  Decor: Flame,
  Accessories: Fan,
}

function getCategoryStats(categoryId: string) {
  const items = MOCK_INVENTORY.filter((i) => i.category === categoryId)
  const totalItems = items.length
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalAvailable = items.reduce((sum, i) => sum + i.available, 0)
  return { totalItems, totalQuantity, totalAvailable }
}

export function InventoryHub() {
  const navigate = useNavigate()

  const totalItems = MOCK_INVENTORY.length
  const totalPieces = MOCK_INVENTORY.reduce((sum, i) => sum + i.quantity, 0)
  const totalAvailable = MOCK_INVENTORY.reduce((sum, i) => sum + i.available, 0)

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-elevated)]">
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-4 pb-4 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Package size={18} className="text-[var(--color-text-secondary)]" />
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Inventario
          </h1>
        </div>
        <div className="flex gap-4 text-[11px] text-[var(--color-text-tertiary)]">
          <span>
            <strong className="text-[var(--color-text-primary)]">{totalItems}</strong> productos
          </span>
          <span>
            <strong className="text-[var(--color-text-primary)]">{totalPieces.toLocaleString()}</strong> piezas total
          </span>
          <span>
            <strong className="text-[var(--color-accent)]">{totalAvailable.toLocaleString()}</strong> disponibles
          </span>
        </div>
      </div>

      {/* Category cards */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <p
          className="text-xs font-medium mb-4"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Selecciona una categoría
        </p>
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] ?? Package
            const stats = getCategoryStats(cat.id)

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
                <div className="flex gap-2 text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  <span>{stats.totalItems} items</span>
                  <span>·</span>
                  <span style={{ color: 'var(--color-accent)' }}>{stats.totalAvailable} disp.</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* View all link */}
        <div className="text-center mt-5">
          <button
            onClick={() => navigate('/category/All')}
            className="text-[11px] font-medium hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            Ver todo el inventario
          </button>
        </div>
      </div>
    </div>
  )
}
