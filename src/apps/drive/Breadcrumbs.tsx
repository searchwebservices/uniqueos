import { ChevronRight, HardDrive } from 'lucide-react'
import type { DbDriveItem } from '@/types/database'

interface BreadcrumbsProps {
  path: DbDriveItem[]
  onNavigate: (folderId: string | null) => void
}

export function Breadcrumbs({ path, onNavigate }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-0.5 text-xs min-w-0 overflow-hidden">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors shrink-0"
        style={{
          color: path.length === 0
            ? 'var(--color-text-primary)'
            : 'var(--color-text-tertiary)',
          fontWeight: path.length === 0 ? 500 : 400,
        }}
      >
        <HardDrive size={12} />
        <span>Drive</span>
      </button>

      {path.map((folder, i) => {
        const isLast = i === path.length - 1
        return (
          <div key={folder.id} className="flex items-center gap-0.5 min-w-0">
            <ChevronRight
              size={10}
              className="shrink-0"
              style={{ color: 'var(--color-text-tertiary)' }}
            />
            <button
              onClick={() => onNavigate(folder.id)}
              className="px-1.5 py-0.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors truncate max-w-[120px]"
              style={{
                color: isLast
                  ? 'var(--color-text-primary)'
                  : 'var(--color-text-tertiary)',
                fontWeight: isLast ? 500 : 400,
              }}
            >
              {folder.name}
            </button>
          </div>
        )
      })}
    </nav>
  )
}
