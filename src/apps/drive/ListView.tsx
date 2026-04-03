import type { DbDriveItem } from '@/types/database'
import { FileRow } from './FileRow'

interface ListViewProps {
  items: DbDriveItem[]
  selectedId: string | null
  onSelect: (id: string | null, e: React.MouseEvent) => void
  onOpen: (item: DbDriveItem) => void
  onContextMenu: (e: React.MouseEvent, item: DbDriveItem) => void
}

export function DriveListView({
  items,
  selectedId,
  onSelect,
  onOpen,
  onContextMenu,
}: ListViewProps) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="grid grid-cols-[1fr_80px_100px_120px] gap-3 px-3 py-1.5 text-[10px] font-medium border-b"
        style={{
          color: 'var(--color-text-tertiary)',
          borderColor: 'var(--color-border-subtle)',
        }}
      >
        <span>Name</span>
        <span>Size</span>
        <span>Type</span>
        <span>Modified</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              background: i % 2 === 1
                ? 'var(--color-bg-tertiary)'
                : undefined,
            }}
          >
            <FileRow
              item={item}
              selected={selectedId === item.id}
              onClick={(e) => onSelect(item.id, e)}
              onDoubleClick={() => onOpen(item)}
              onContextMenu={(e) => onContextMenu(e, item)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
