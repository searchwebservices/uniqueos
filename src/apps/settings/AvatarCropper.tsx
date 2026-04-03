import { useState, useRef, useCallback, useEffect } from 'react'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface Props {
  file: File
  onCrop: (blob: Blob) => void
  onCancel: () => void
}

const OUTPUT_SIZE = 256

export function AvatarCropper({ file, onCrop, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const offsetStart = useRef({ x: 0, y: 0 })

  // Load image from file
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      // Initial scale: fit the shorter side to the canvas
      const minDim = Math.min(img.width, img.height)
      setScale(OUTPUT_SIZE / minDim)
      setOffset({ x: 0, y: 0 })
      setImageLoaded(true)
    }
    img.src = URL.createObjectURL(file)
    return () => URL.revokeObjectURL(img.src)
  }, [file])

  // Draw preview
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)

    // Draw circular clip
    ctx.save()
    ctx.beginPath()
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2)
    ctx.clip()

    // Draw image centered + offset + scaled
    const drawW = img.width * scale
    const drawH = img.height * scale
    const x = (OUTPUT_SIZE - drawW) / 2 + offset.x
    const y = (OUTPUT_SIZE - drawH) / 2 + offset.y

    ctx.drawImage(img, x, y, drawW, drawH)
    ctx.restore()

    // Draw circular border
    ctx.beginPath()
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2 - 1, 0, Math.PI * 2)
    ctx.strokeStyle = 'var(--color-border)'
    ctx.lineWidth = 2
    ctx.stroke()
  }, [scale, offset])

  useEffect(() => {
    if (imageLoaded) draw()
  }, [imageLoaded, draw])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    offsetStart.current = { ...offset }
  }, [offset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return
    setOffset({
      x: offsetStart.current.x + (e.clientX - dragStart.current.x),
      y: offsetStart.current.y + (e.clientY - dragStart.current.y),
    })
  }, [dragging])

  const handleMouseUp = useCallback(() => {
    setDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale(prev => Math.max(0.1, Math.min(5, prev - e.deltaY * 0.001)))
  }, [])

  const handleCrop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (blob) onCrop(blob)
    }, 'image/png')
  }, [onCrop])

  const handleReset = useCallback(() => {
    const img = imgRef.current
    if (!img) return
    const minDim = Math.min(img.width, img.height)
    setScale(OUTPUT_SIZE / minDim)
    setOffset({ x: 0, y: 0 })
  }, [])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999, background: 'rgba(0,0,0,0.5)' }}
      onClick={onCancel}
    >
      <div
        className="p-5 rounded-[var(--radius-lg)] space-y-4"
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          Crop profile picture
        </h3>

        {/* Canvas preview */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={OUTPUT_SIZE}
            height={OUTPUT_SIZE}
            className="rounded-full cursor-grab active:cursor-grabbing"
            style={{
              width: 200,
              height: 200,
              background: 'var(--color-bg-tertiary)',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
        </div>

        {/* Zoom controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setScale(prev => Math.max(0.1, prev - 0.1))}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <ZoomOut size={14} />
          </button>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.01"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-32 accent-[var(--color-accent)]"
          />
          <button
            onClick={() => setScale(prev => Math.min(5, prev + 0.1))}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={handleReset}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            style={{ color: 'var(--color-text-tertiary)' }}
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        <p className="text-[10px] text-center" style={{ color: 'var(--color-text-tertiary)' }}>
          Drag to reposition. Scroll to zoom.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] border hover:bg-[var(--color-bg-tertiary)] transition-colors"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-md)] font-medium text-[var(--color-text-inverse)] transition-colors"
            style={{ background: 'var(--color-accent)' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
