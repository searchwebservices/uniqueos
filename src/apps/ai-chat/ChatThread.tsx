import { useEffect, useRef } from 'react'
import { MessageSquare } from 'lucide-react'
import { useMessages, useSendMessage, useAIUsage } from './hooks'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'

interface Props {
  conversationId: string | null
}

export function ChatThread({ conversationId }: Props) {
  const { messages, isLoading } = useMessages(conversationId)
  const sendMessage = useSendMessage()
  const usage = useAIUsage()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <MessageSquare size={28} style={{ color: 'var(--color-text-tertiary)' }} />
        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          Select a conversation or start a new one
        </span>
      </div>
    )
  }

  const handleSend = (content: string) => {
    sendMessage.mutate({
      conversationId,
      content,
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="text-center py-4">
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Loading messages...
            </span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <MessageSquare size={20} style={{ color: 'var(--color-text-tertiary)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Start the conversation
            </span>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={usage.remaining <= 0}
        isPending={sendMessage.isPending}
      />
    </div>
  )
}
