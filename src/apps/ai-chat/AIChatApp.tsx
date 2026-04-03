import { useState } from 'react'
import { ConversationList } from './ConversationList'
import { ChatThread } from './ChatThread'
import { UsageIndicator } from './UsageIndicator'

export function AIChatApp() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div
        className="w-52 shrink-0 flex flex-col border-r"
        style={{
          borderColor: 'var(--color-border)',
          background: 'var(--color-bg-primary)',
        }}
      >
        <ConversationList
          activeId={activeConversationId}
          onSelect={(id) => setActiveConversationId(id || null)}
        />
        <UsageIndicator />
      </div>

      {/* Main chat area */}
      <div className="flex-1 min-w-0">
        <ChatThread conversationId={activeConversationId} />
      </div>
    </div>
  )
}
