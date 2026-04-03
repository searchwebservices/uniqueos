import { useState } from 'react'
import { Sparkles, Download, Monitor } from 'lucide-react'
import { toast } from 'sonner'
import { useImageGeneration, useImageUsage } from './hooks'
import { ImageGallery } from './ImageGallery'

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3'] as const

export function ImageGeneratorApp() {
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState<string>('1:1')
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery'>('generate')
  const generate = useImageGeneration()
  const usage = useImageUsage()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Enter a prompt first')
      return
    }
    if (usage.remaining <= 0) {
      toast.error('Daily limit reached. Try again tomorrow.')
      return
    }

    const url = await generate.mutateAsync({ prompt: prompt.trim(), aspectRatio })
    if (url) {
      setGeneratedUrl(url)
    }
  }

  const handleDownload = () => {
    if (!generatedUrl) return
    const a = document.createElement('a')
    a.href = generatedUrl
    a.download = `generated-${Date.now()}.png`
    a.click()
    toast.success('Image downloaded')
  }

  const handleSetWallpaper = () => {
    toast.info('Set as wallpaper will be available in a future update')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div
        className="flex border-b shrink-0"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {(['generate', 'gallery'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-xs font-medium transition-colors"
            style={{
              color: activeTab === tab
                ? 'var(--color-accent)'
                : 'var(--color-text-secondary)',
              borderBottom: activeTab === tab
                ? '2px solid var(--color-accent)'
                : '2px solid transparent',
            }}
          >
            {tab === 'generate' ? 'Generate' : 'Gallery'}
          </button>
        ))}
      </div>

      {activeTab === 'generate' ? (
        <div className="flex flex-col gap-4 p-4 overflow-auto flex-1">
          {/* Usage indicator */}
          <div className="flex items-center justify-between">
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {usage.remaining}/{usage.limit} images remaining today
            </span>
          </div>

          {/* Prompt */}
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] outline-none resize-none"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* Aspect ratio */}
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Aspect ratio
            </label>
            <div className="flex gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className="px-3 py-1 text-xs rounded-[var(--radius-md)] transition-colors"
                  style={{
                    background: aspectRatio === ratio
                      ? 'var(--color-accent)'
                      : 'var(--color-bg-secondary)',
                    color: aspectRatio === ratio
                      ? 'var(--color-accent-foreground)'
                      : 'var(--color-text-secondary)',
                    border: `1px solid ${aspectRatio === ratio ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  }}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generate.isPending || usage.remaining <= 0}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-colors disabled:opacity-50"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-accent-foreground)',
            }}
          >
            <Sparkles size={14} />
            {generate.isPending ? 'Generating...' : 'Generate'}
          </button>

          {/* Generated image display */}
          {generatedUrl && (
            <div className="flex flex-col items-center gap-3">
              <div
                className="rounded-[var(--radius-lg)] overflow-hidden"
                style={{
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <img
                  src={generatedUrl}
                  alt="Generated"
                  className="max-w-full max-h-64 object-contain"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={handleSetWallpaper}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <Monitor size={14} />
                  Set as wallpaper
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <ImageGallery />
        </div>
      )}
    </div>
  )
}
