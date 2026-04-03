import ReactMarkdown from 'react-markdown'
import type { DbAiMessage } from '@/types/database'

interface Props {
  message: DbAiMessage
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'
  const time = new Date(message.created_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className="max-w-[80%] px-3 py-2 rounded-[var(--radius-lg)]"
        style={{
          background: isUser
            ? 'var(--color-accent)'
            : 'var(--color-bg-secondary)',
          color: isUser
            ? 'var(--color-accent-foreground)'
            : 'var(--color-text-primary)',
        }}
      >
        {isUser ? (
          <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-xs leading-relaxed prose-sm [&_p]:m-0 [&_ul]:m-0 [&_ol]:m-0 [&_li]:m-0 [&_code]:text-[10px] [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-[var(--color-bg-tertiary)]">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        <span
          className="block text-[9px] mt-1 opacity-60"
          style={{
            color: isUser ? 'var(--color-accent-foreground)' : 'var(--color-text-tertiary)',
          }}
        >
          {time}
        </span>
      </div>
    </div>
  )
}
