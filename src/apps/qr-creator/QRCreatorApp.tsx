import { useState, useRef, useEffect, useCallback } from 'react'
import { Download, Save } from 'lucide-react'
import QRCode from 'qrcode'
import { toast } from 'sonner'

const DEFAULT_SIZE = 256
const MIN_SIZE = 128
const MAX_SIZE = 512

export function QRCreatorApp() {
  const [text, setText] = useState('')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState(DEFAULT_SIZE)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const renderQR = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const value = text.trim() || 'https://example.com'
    try {
      await QRCode.toCanvas(canvas, value, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      })
    } catch {
      // Invalid input — clear canvas
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [text, fgColor, bgColor, size])

  useEffect(() => {
    renderQR()
  }, [renderQR])

  const handleDownloadPNG = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'qr-code.png'
    a.click()
    toast.success('PNG downloaded')
  }, [])

  const handleDownloadSVG = useCallback(async () => {
    const value = text.trim() || 'https://example.com'
    try {
      const svgString = await QRCode.toString(value, {
        type: 'svg',
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      })

      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'qr-code.svg'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('SVG downloaded')
    } catch {
      toast.error('Failed to generate SVG')
    }
  }, [text, fgColor, bgColor, size])

  const handleSaveToDrive = useCallback(() => {
    toast.info('Save to Drive will be available when Drive integration is complete')
  }, [])

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex flex-col items-center gap-6 p-6">
        {/* Input */}
        <div className="w-full max-w-md">
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Text or URL
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or URL..."
            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] outline-none transition-colors"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        {/* QR Preview */}
        <div
          className="flex items-center justify-center rounded-[var(--radius-lg)] p-4"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <canvas ref={canvasRef} />
        </div>

        {/* Customization */}
        <div className="w-full max-w-md grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Foreground color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
              />
              <span
                className="text-xs font-mono"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {fgColor}
              </span>
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Background color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
              />
              <span
                className="text-xs font-mono"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {bgColor}
              </span>
            </div>
          </div>

          <div className="col-span-2">
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Size: {size}px
            </label>
            <input
              type="range"
              min={MIN_SIZE}
              max={MAX_SIZE}
              step={8}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-accent-foreground)',
            }}
          >
            <Download size={14} />
            Download PNG
          </button>
          <button
            onClick={handleDownloadSVG}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <Download size={14} />
            Download SVG
          </button>
          <button
            onClick={handleSaveToDrive}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <Save size={14} />
            Save to Drive
          </button>
        </div>
      </div>
    </div>
  )
}
