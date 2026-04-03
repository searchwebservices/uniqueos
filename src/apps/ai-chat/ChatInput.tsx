import { useState, useRef, useCallback } from 'react'
import { Send } from 'lucide-react'

interface Props {
  onSend: (content: string) => void
  disabled: boolean
  isPending: boolean
}

export function ChatInput({ onSend, disabled, isPending }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled || isPending) return
    onSend(trimmed)
    setValue('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, disabled, isPending, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleInput = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [])

  return (
    <div
      className="flex items-end gap-2 p-3 border-t"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={disabled ? 'Daily limit reached' : 'Type a message...'}
        disabled={disabled}
        rows={1}
        className="flex-1 px-3 py-2 text-xs rounded-[var(--radius-md)] outline-none resize-none disabled:opacity-50"
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          maxHeight: 120,
        }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled || isPending}
        className="p-2 rounded-[var(--radius-md)] transition-colors disabled:opacity-30"
        style={{
          background: 'var(--color-accent)',
          color: 'var(--color-accent-foreground)',
        }}
      >
        <Send size={14} />
      </button>
    </div>
  )
}
