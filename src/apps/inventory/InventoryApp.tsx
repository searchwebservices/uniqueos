import { useState } from 'react'
import { Search, Plus, Package, Grid3X3, List, ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { CATEGORIES, MOCK_INVENTORY } from './inventory-data'

export function InventoryApp() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const initialCategory = categoryId && categoryId !== 'All' ? categoryId : 'All'

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const allCategories = [{ id: 'All', label: 'Todos' }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))]

  const filtered = MOCK_INVENTORY.filter((item) => {
    if (category !== 'All' && item.category !== category) return false
    if (
      search &&
      !item.name.toLowerCase().includes(search.toLowerCase()) &&
      !item.category.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="app-container flex flex-col h-full bg-[var(--color-bg-elevated)]">
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
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Inventario</h1>
            <span className="text-xs text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] px-2 py-0.5 rounded-full">
              {filtered.length} items
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex rounded-lg border overflow-hidden"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <button
                onClick={() => setView('grid')}
                className="p-1.5 transition-colors"
                style={{
                  background: view === 'grid' ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                }}
              >
                <Grid3X3
                  size={14}
                  style={{
                    color:
                      view === 'grid' ? 'var(--color-text-inverse)' : 'var(--color-text-tertiary)',
                  }}
                />
              </button>
              <button
                onClick={() => setView('list')}
                className="p-1.5 transition-colors"
                style={{
                  background: view === 'list' ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                }}
              >
                <List
                  size={14}
                  style={{
                    color:
                      view === 'list' ? 'var(--color-text-inverse)' : 'var(--color-text-tertiary)',
                  }}
                />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-accent)] text-[var(--color-text-inverse)]">
              <Plus size={14} />
              Agregar
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="search-container flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_2px_var(--color-accent-subtle)]"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}
          >
            <Search size={14} className="text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              placeholder="Buscar item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap"
              style={{
                background: category === cat.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: category === cat.id ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {view === 'grid' ? (
          <div className="max-w-5xl mx-auto">
            <div className="inventory-grid">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border overflow-hidden transition-all hover:shadow-sm"
                  style={{
                    borderColor: 'var(--color-border)',
                    background: 'var(--color-bg-elevated)',
                  }}
                >
                  <div className="aspect-square bg-[var(--color-bg-secondary)] overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-[var(--color-text-primary)] leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
                      {item.category}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-semibold text-[var(--color-accent)]">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-tertiary)]">
                        <Package size={10} className="inline mr-0.5" />
                        {item.available}/{item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-1">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-bg-elevated)',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">{item.category}</p>
                </div>
                <span className="text-xs font-semibold text-[var(--color-accent)]">
                  ${item.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-[var(--color-text-tertiary)] w-14 text-right">
                  {item.available}/{item.quantity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
