import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  Plus,
  Phone,
  Mail,
  Instagram,
} from 'lucide-react'
import { VENDOR_CATEGORIES, MOCK_VENDORS, type Vendor } from './vendors-data'

export function VendorsList() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const isAll = categoryId === 'all'
  const categoryInfo = VENDOR_CATEGORIES.find((c) => c.id === categoryId)

  const filtered = MOCK_VENDORS.filter((v) => {
    if (!isAll && v.category !== categoryId) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        v.name.toLowerCase().includes(q) ||
        v.contact.toLowerCase().includes(q) ||
        v.services.some((s) => s.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-elevated)]">
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-4 pb-3 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <ArrowLeft size={16} className="text-[var(--color-text-secondary)]" />
            </button>
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {isAll ? 'Todos los Proveedores' : categoryInfo?.label ?? 'Proveedores'}
            </h1>
            <span className="text-xs text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-accent)] text-[var(--color-text-inverse)]">
            <Plus size={14} />
            Agregar
          </button>
        </div>

        <div
          className="search-container flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_2px_var(--color-accent-subtle)]"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}
        >
          <Search size={14} className="text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            placeholder="Buscar proveedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
          />
        </div>
      </div>

      {/* Vendor list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="max-w-2xl mx-auto space-y-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <p className="text-sm text-[var(--color-text-tertiary)]">
                No se encontraron proveedores
              </p>
            </div>
          ) : (
            filtered.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} showCategory={isAll} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function VendorCard({ vendor, showCategory }: { vendor: Vendor; showCategory: boolean }) {
  const categoryInfo = VENDOR_CATEGORIES.find((c) => c.id === vendor.category)

  return (
    <div
      className="p-4 rounded-lg border transition-all hover:shadow-sm"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {vendor.name}
            </span>
            {showCategory && categoryInfo && (
              <span
                className="px-1.5 py-0.5 rounded-full text-[9px] font-medium"
                style={{
                  background: `${categoryInfo.color}15`,
                  color: categoryInfo.color,
                }}
              >
                {categoryInfo.label}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--color-text-tertiary)]">
            {vendor.contact}
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="flex flex-wrap gap-1 mb-2">
        {vendor.services.slice(0, 3).map((s) => (
          <span
            key={s}
            className="px-2 py-0.5 rounded-full text-[9px]"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {s}
          </span>
        ))}
        {vendor.services.length > 3 && (
          <span
            className="px-2 py-0.5 rounded-full text-[9px]"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            +{vendor.services.length - 3} más
          </span>
        )}
      </div>

      {/* Contact info */}
      <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-tertiary)]">
        {vendor.phone && (
          <span className="flex items-center gap-1">
            <Phone size={10} />
            {vendor.phone}
          </span>
        )}
        {vendor.instagram && (
          <span className="flex items-center gap-1">
            <Instagram size={10} />
            {vendor.instagram}
          </span>
        )}
        {vendor.email && (
          <span className="flex items-center gap-1">
            <Mail size={10} />
            {vendor.email}
          </span>
        )}
      </div>

      {/* Notes */}
      {vendor.notes && (
        <p
          className="text-[10px] mt-2 italic"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {vendor.notes}
        </p>
      )}
    </div>
  )
}
