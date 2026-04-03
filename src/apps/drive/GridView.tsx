import type { DbDriveItem } from '@/types/database'
import { FileCard } from './FileCard'

interface GridViewProps {
  items: DbDriveItem[]
  selectedId: string | null
  onSelect: (id: string | null, e: React.MouseEvent) => void
  onOpen: (item: DbDriveItem) => void
  onContextMenu: (e: React.MouseEvent, item: DbDriveItem) => void
}

export function GridView({
  items,
  selectedId,
  onSelect,
  onOpen,
  onContextMenu,
}: GridViewProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2 p-3">
      {items.map((item) => (
        <FileCard
          key={item.id}
          item={item}
          selected={selectedId === item.id}
          onClick={(e) => onSelect(item.id, e)}
          onDoubleClick={() => onOpen(item)}
          onContextMenu={(e) => onContextMenu(e, item)}
        />
      ))}
    </div>
  )
}
