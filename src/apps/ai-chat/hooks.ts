import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import type { DbAiConversation, DbAiMessage, DbAiUsage } from '@/types/database'

const CONVERSATIONS_KEY = 'ai-conversations'
const MESSAGES_KEY = 'ai-messages'
const USAGE_KEY = 'ai-usage-chat'

export function useConversations() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [CONVERSATIONS_KEY, user.id],
    queryFn: async (): Promise<DbAiConversation[]> => {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data ?? []
    },
  })

  const createConversation = useMutation({
    mutationFn: async (title?: string): Promise<DbAiConversation> => {
      const now = new Date().toISOString()
      const record: DbAiConversation = {
        id: crypto.randomUUID(),
        user_id: user.id,
        title: title ?? 'New conversation',
        model: 'default',
        created_at: now,
        updated_at: now,
      }

      const { error } = await supabase.from('ai_conversations').insert(record)
      if (error) throw error
      return record
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY] })
    },
  })

  const updateConversation = useMutation({
    mutationFn: async (input: { id: string; title: string }) => {
      const now = new Date().toISOString()
      const { error } = await supabase
        .from('ai_conversations')
        .update({ title: input.title, updated_at: now })
        .eq('id', input.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY] })
    },
  })

  const deleteConversation = useMutation({
    mutationFn: async (id: string) => {
      // Delete messages first
      await supabase.from('ai_messages').delete().eq('conversation_id', id)
      const { error } = await supabase.from('ai_conversations').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY] })
    },
  })

  return {
    conversations: query.data ?? [],
    isLoading: query.isLoading,
    createConversation,
    updateConversation,
    deleteConversation,
  }
}

export function useMessages(conversationId: string | null) {
  const query = useQuery({
    queryKey: [MESSAGES_KEY, conversationId],
    queryFn: async (): Promise<DbAiMessage[]> => {
      if (!conversationId) return []

      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data ?? []
    },
    enabled: !!conversationId,
  })

  return {
    messages: query.data ?? [],
    isLoading: query.isLoading,
  }
}

export function useSendMessage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      conversationId: string
      content: string
    }): Promise<{ userMsg: DbAiMessage; assistantMsg: DbAiMessage }> => {
      const now = new Date().toISOString()

      // Insert user message
      const userMsg: DbAiMessage = {
        id: crypto.randomUUID(),
        conversation_id: input.conversationId,
        role: 'user',
        content: input.content,
        created_at: now,
      }

      const { error: userError } = await supabase.from('ai_messages').insert(userMsg)
      if (userError) throw userError

      // Placeholder assistant response
      const assistantMsg: DbAiMessage = {
        id: crypto.randomUUID(),
        conversation_id: input.conversationId,
        role: 'assistant',
        content: 'AI chat not configured yet. Connect a Google AI Studio API key in Settings.',
        created_at: new Date(Date.now() + 1).toISOString(),
      }

      const { error: assistantError } = await supabase.from('ai_messages').insert(assistantMsg)
      if (assistantError) throw assistantError

      // Update conversation updated_at
      await supabase
        .from('ai_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', input.conversationId)

      // Increment usage
      const today = new Date().toISOString().slice(0, 10)
      const { data: existing } = await supabase
        .from('ai_usage')
        .select('id, message_count')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('ai_usage')
          .update({ message_count: existing.message_count + 1 })
          .eq('id', existing.id)
      } else {
        const usageRecord: DbAiUsage = {
          id: crypto.randomUUID(),
          user_id: user.id,
          date: today,
          message_count: 1,
        }
        await supabase.from('ai_usage').insert(usageRecord)
      }

      return { userMsg, assistantMsg }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_KEY, variables.conversationId] })
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY] })
      queryClient.invalidateQueries({ queryKey: [USAGE_KEY] })
    },
  })
}

export function useAIUsage() {
  const { user } = useAuth()
  const today = new Date().toISOString().slice(0, 10)

  const query = useQuery({
    queryKey: [USAGE_KEY, user.id, today],
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase
        .from('ai_usage')
        .select('message_count')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle()

      if (error) throw error
      return data?.message_count ?? 0
    },
  })

  const dailyLimit = 50

  return {
    used: query.data ?? 0,
    remaining: Math.max(0, dailyLimit - (query.data ?? 0)),
    limit: dailyLimit,
    isLoading: query.isLoading,
  }
}
