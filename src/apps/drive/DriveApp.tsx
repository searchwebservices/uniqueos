import { useState, useCallback } from 'react'
import {
  ArrowLeft,
  LayoutGrid,
  LayoutList,
  Upload,
  FolderPlus,
} from 'lucide-react'
import type { DbDriveItem } from '@/types/database'
import { useDriveItems, useFolderPath, getSignedUrl } from './hooks'
import { Breadcrumbs } from './Breadcrumbs'
import { GridView } from './GridView'
import { DriveListView } from './ListView'
import { FileUploader } from './FileUploader'
import { FilePreview } from './FilePreview'
import { FileContextMenu } from './FileContextMenu'
import { NewFolderDialog } from './NewFolderDialog'
import { PublishDialog } from './PublishDialog'
import { cn } from '@/lib/cn'

type ViewMode = 'grid' | 'list'

interface ContextMenuState {
  item: DbDriveItem
  position: { x: number; y: number }
}

export function DriveApp() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showUploader, setShowUploader] = useState(false)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [previewItem, setPreviewItem] = useState<DbDriveItem | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [publishItem, setPublishItem] = useState<DbDriveItem | null>(null)
  const [renameItem, setRenameItem] = useState<DbDriveItem | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const {
    items,
    isLoading,
    createFolder,
    uploadFile,
    renameItem: renameItemMutation,
    deleteItem,
    publishItem: publishItemMutation,
    unpublishItem,
  } = useDriveItems(currentFolderId)

  const { data: folderPath } = useFolderPath(currentFolderId)

  const handleNavigate = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId)
    setSelectedId(null)
    setContextMenu(null)
  }, [])

  const handleOpen = useCallback(
    (item: DbDriveItem) => {
      if (item.type === 'folder') {
        handleNavigate(item.id)
      } else {
        setPreviewItem(item)
      }
    },
    [handleNavigate],
  )

  const handleSelect = useCallback(
    (id: string | null, _e: React.MouseEvent) => {
      setSelectedId(id)
    },
    [],
  )

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, item: DbDriveItem) => {
      e.preventDefault()
      setSelectedId(item.id)
      setContextMenu({ item, position: { x: e.clientX, y: e.clientY } })
    },
    [],
  )

  const handleBack = useCallback(() => {
    if (!folderPath || folderPath.length === 0) return
    const parentId =
      folderPath.length > 1 ? folderPath[folderPath.length - 2].id : null
    handleNavigate(parentId)
  }, [folderPath, handleNavigate])

  const handleUpload = useCallback(
    (files: File[]) => {
      for (const file of files) {
        uploadFile.mutate(file)
      }
      setShowUploader(false)
    },
    [uploadFile],
  )

  const handleCreateFolder = useCallback(
    (name: string) => {
      createFolder.mutate(name)
      setShowNewFolder(false)
    },
    [createFolder],
  )

  const handleDownload = useCallback(async (item: DbDriveItem) => {
    if (!item.storage_path) return
    const url = await getSignedUrl(item.storage_path)
    window.open(url, '_blank')
  }, [])

  const handleRenameStart = useCallback((item: DbDriveItem) => {
    setRenameItem(item)
    setRenameValue(item.name)
  }, [])

  const handleRenameSubmit = useCallback(() => {
    if (renameItem && renameValue.trim()) {
      renameItemMutation.mutate({ id: renameItem.id, name: renameValue.trim() })
    }
    setRenameItem(null)
  }, [renameItem, renameValue, renameItemMutation])

  const isEmpty = !isLoading && items.length === 0

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-elevated)]">
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b shrink-0"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        {/* Back button */}
        <button
          onClick={handleBack}
          disabled={currentFolderId === null}
          className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors disabled:opacity-30"
          style={{ color: 'var(--color-text-secondary)' }}
          title="Go back"
        >
          <ArrowLeft size={14} />
        </button>

        {/* Breadcrumbs */}
        <div className="flex-1 min-w-0">
          <Breadcrumbs
            path={folderPath ?? []}
            onNavigate={handleNavigate}
          />
        </div>

        {/* View toggle */}
        <div
          className="flex rounded-[var(--radius-md)] border overflow-hidden"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-1.5 transition-colors',
              viewMode === 'grid'
                ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]',
            )}
            title="Grid view"
          >
            <LayoutGrid size={13} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-1.5 transition-colors',
              viewMode === 'list'
                ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]',
            )}
            title="List view"
          >
            <LayoutList size={13} />
          </button>
        </div>

        {/* Upload button */}
        <button
          onClick={() => setShowUploader(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-[var(--radius-md)] border transition-colors hover:bg-[var(--color-bg-tertiary)]"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Upload size={12} />
          Upload
        </button>

        {/* New folder button */}
        <button
          onClick={() => setShowNewFolder(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)] transition-colors hover:opacity-90"
          style={{ background: 'var(--color-accent)' }}
        >
          <FolderPlus size={12} />
          Folder
        </button>
      </div>

      {/* Content */}
      <div
        className="flex-1 min-h-0 overflow-auto"
        onClick={() => {
          setSelectedId(null)
          setContextMenu(null)
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-[var(--color-text-tertiary)]">
              Loading...
            </span>
          </div>
        ) : showUploader || isEmpty ? (
          <div className="p-4 flex flex-col gap-4">
            {!isEmpty && items.length > 0 && null}
            <FileUploader
              onUpload={handleUpload}
              uploading={uploadFile.isPending}
            />
            {isEmpty && !showUploader && (
              <div className="flex flex-col items-center gap-2 py-8">
                <p className="text-sm text-[var(--color-text-tertiary)]">
                  This folder is empty
                </p>
              </div>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <GridView
            items={items}
            selectedId={selectedId}
            onSelect={handleSelect}
            onOpen={handleOpen}
            onContextMenu={handleContextMenu}
          />
        ) : (
          <DriveListView
            items={items}
            selectedId={selectedId}
            onSelect={handleSelect}
            onOpen={handleOpen}
            onContextMenu={handleContextMenu}
          />
        )}
      </div>

      {/* Dialogs */}
      {showNewFolder && (
        <NewFolderDialog
          onConfirm={handleCreateFolder}
          onClose={() => setShowNewFolder(false)}
        />
      )}

      {previewItem && (
        <FilePreview
          item={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}

      {contextMenu && (
        <FileContextMenu
          item={contextMenu.item}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
          onOpen={() => handleOpen(contextMenu.item)}
          onRename={() => handleRenameStart(contextMenu.item)}
          onMove={() => {
            // TODO: move-to picker
            setContextMenu(null)
          }}
          onPublish={() => {
            setPublishItem(contextMenu.item)
            setContextMenu(null)
          }}
          onDownload={() => handleDownload(contextMenu.item)}
          onDelete={() => {
            deleteItem.mutate(contextMenu.item)
            setContextMenu(null)
          }}
        />
      )}

      {publishItem && (
        <PublishDialog
          item={publishItem}
          publishing={publishItemMutation.isPending || unpublishItem.isPending}
          onPublish={() => {
            publishItemMutation.mutate(publishItem, {
              onSuccess: () => setPublishItem(null),
            })
          }}
          onUnpublish={() => {
            unpublishItem.mutate(publishItem, {
              onSuccess: () => setPublishItem(null),
            })
          }}
          onClose={() => setPublishItem(null)}
        />
      )}

      {/* Inline rename */}
      {renameItem && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setRenameItem(null)}
        >
          <div
            className="w-[300px] p-4 rounded-[var(--radius-lg)] shadow-lg"
            style={{ background: 'var(--color-bg-elevated)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-sm font-medium mb-3"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Rename
            </h3>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit()
                if (e.key === 'Escape') setRenameItem(null)
              }}
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border outline-none mb-3"
              style={{
                borderColor: 'var(--color-border)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text-primary)',
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRenameItem(null)}
                className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] border hover:bg-[var(--color-bg-tertiary)] transition-colors"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRenameSubmit}
                className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)]"
                style={{ background: 'var(--color-accent)' }}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
