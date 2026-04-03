import { useState } from 'react'
import { Search, Plus, Package, Grid3X3, List } from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  available: number
  image: string
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Mexican Pink Napkin', category: 'Textiles', price: 4.00, quantity: 200, available: 164, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=200&h=200&fit=crop' },
  { id: '2', name: 'Gold Silverware Set (5pc)', category: 'Cutlery', price: 5.00, quantity: 150, available: 114, image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=200&h=200&fit=crop' },
  { id: '3', name: 'Green Water Glass', category: 'Glassware', price: 4.00, quantity: 180, available: 144, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=200&h=200&fit=crop' },
  { id: '4', name: 'Ivory Table Runner', category: 'Textiles', price: 8.00, quantity: 60, available: 52, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&h=200&fit=crop' },
  { id: '5', name: 'Gold Charger Plate', category: 'Tableware', price: 6.00, quantity: 120, available: 61, image: 'https://images.unsplash.com/photo-1507914997-8ed6c0f67a08?w=200&h=200&fit=crop' },
  { id: '6', name: 'Cylinder Candle Holder', category: 'Decor', price: 3.50, quantity: 100, available: 88, image: 'https://images.unsplash.com/photo-1602523961358-f9f03a557d3e?w=200&h=200&fit=crop' },
  { id: '7', name: 'White Votive Candle', category: 'Decor', price: 1.50, quantity: 500, available: 423, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop' },
  { id: '8', name: 'Wooden Fan (Ceremony)', category: 'Accessories', price: 2.00, quantity: 200, available: 141, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=200&h=200&fit=crop' },
  { id: '9', name: 'Champagne Flute Crystal', category: 'Glassware', price: 5.50, quantity: 100, available: 100, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&h=200&fit=crop' },
  { id: '10', name: 'Blush Napkin', category: 'Textiles', price: 4.00, quantity: 150, available: 150, image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&h=200&fit=crop' },
  { id: '11', name: 'Silver Charger Plate', category: 'Tableware', price: 6.00, quantity: 80, available: 80, image: 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=200&h=200&fit=crop' },
  { id: '12', name: 'Navy Napkin', category: 'Textiles', price: 4.00, quantity: 120, available: 120, image: 'https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?w=200&h=200&fit=crop' },
]

const CATEGORIES = ['All', 'Textiles', 'Cutlery', 'Glassware', 'Tableware', 'Decor', 'Accessories']

export function InventoryApp() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filtered = MOCK_INVENTORY.filter(item => {
    if (category !== 'All' && item.category !== category) return false
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="app-container flex flex-col h-full bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Inventario</h1>
            <span className="text-xs text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] px-2 py-0.5 rounded-full">
              {MOCK_INVENTORY.length} items
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setView('grid')}
                className="p-1.5 transition-colors"
                style={{ background: view === 'grid' ? 'var(--color-accent)' : 'var(--color-bg-secondary)' }}
              >
                <Grid3X3 size={14} style={{ color: view === 'grid' ? 'var(--color-text-inverse)' : 'var(--color-text-tertiary)' }} />
              </button>
              <button
                onClick={() => setView('list')}
                className="p-1.5 transition-colors"
                style={{ background: view === 'list' ? 'var(--color-accent)' : 'var(--color-bg-secondary)' }}
              >
                <List size={14} style={{ color: view === 'list' ? 'var(--color-text-inverse)' : 'var(--color-text-tertiary)' }} />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-accent)] text-[var(--color-text-inverse)]">
              <Plus size={14} />
              Agregar
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="search-container flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_2px_var(--color-accent-subtle)]" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>
            <Search size={14} className="text-[var(--color-text-tertiary)]" />
            <input
              type="text" placeholder="Buscar item..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat} onClick={() => setCategory(cat)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap"
              style={{
                background: category === cat ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: category === cat ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {view === 'grid' ? (
          <div className="max-w-5xl mx-auto">
            <div className="inventory-grid">
              {filtered.map(item => (
                <div
                  key={item.id}
                  className="rounded-xl border overflow-hidden transition-all hover:shadow-sm"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}
                >
                  <div className="aspect-square bg-[var(--color-bg-secondary)] overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-[var(--color-text-primary)] leading-tight">{item.name}</p>
                    <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">{item.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-semibold text-[var(--color-accent)]">${item.price.toFixed(2)}</span>
                      <span className="text-[10px] text-[var(--color-text-tertiary)]">
                        <Package size={10} className="inline mr-0.5" />{item.available}/{item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-1">
            {filtered.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}
              >
                <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">{item.name}</p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">{item.category}</p>
                </div>
                <span className="text-xs font-semibold text-[var(--color-accent)]">${item.price.toFixed(2)}</span>
                <span className="text-[10px] text-[var(--color-text-tertiary)] w-14 text-right">{item.available}/{item.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
