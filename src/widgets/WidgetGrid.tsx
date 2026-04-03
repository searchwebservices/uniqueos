import { useCallback, useRef, useEffect, useState, useMemo } from 'react'
import { GridLayout, noCompactor } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useWidgetStore } from '@/stores/widget-store'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { getWidgetType } from './registry'
import { WidgetFrame } from './WidgetFrame'
import type { Layout } from 'react-grid-layout'

export function WidgetGrid() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)
  const allWidgets = useWidgetStore((s) => s.widgets)
  const moveWidget = useWidgetStore((s) => s.moveWidget)
  const widgets = useMemo(
    () => allWidgets.filter((w) => w.workspaceId === activeWorkspaceId && !w.hidden),
    [allWidgets, activeWorkspaceId]
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const layout: Layout = widgets.map((w) => {
    const entry = getWidgetType(w.type)
    return {
      i: w.id,
      x: w.layout.x,
      y: w.layout.y,
      w: w.layout.w,
      h: w.layout.h,
      minW: entry?.minSize.w,
      minH: entry?.minSize.h,
      maxW: entry?.maxSize?.w,
      maxH: entry?.maxSize?.h,
    }
  }) as unknown as Layout

  const handleLayoutChange = useCallback(
    (newLayout: Layout) => {
      for (const item of newLayout) {
        const widget = widgets.find((wg) => wg.id === item.i)
        if (!widget) continue
        const { x, y, w, h } = item
        if (
          widget.layout.x !== x ||
          widget.layout.y !== y ||
          widget.layout.w !== w ||
          widget.layout.h !== h
        ) {
          moveWidget(widget.id, { x, y, w, h })
        }
      }
    },
    [widgets, moveWidget]
  )

  if (widgets.length === 0 || containerWidth === 0) {
    return <div ref={containerRef} className="absolute inset-0" />
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      <GridLayout
        className="widget-grid"
        layout={layout}
        width={containerWidth}
        compactor={noCompactor}
        gridConfig={{ cols: 24, rowHeight: 40, margin: [10, 10], containerPadding: null, maxRows: Infinity }}
        dragConfig={{ enabled: true, bounded: false, handle: '.widget-drag-handle' }}
        resizeConfig={{ enabled: true, handles: ['se'] }}
        onLayoutChange={handleLayoutChange}
      >
        {widgets.map((widget) => (
          <div key={widget.id}>
            <WidgetFrame widget={widget} />
          </div>
        ))}
      </GridLayout>
    </div>
  )
}
