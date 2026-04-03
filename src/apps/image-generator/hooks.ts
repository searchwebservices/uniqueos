import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from 'sonner'

interface GeneratedImage {
  name: string
  url: string
  created_at: string
}

interface GenerateInput {
  prompt: string
  aspectRatio: string
}

export function useImageGeneration() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const generate = useMutation({
    mutationFn: async (_input: GenerateInput): Promise<string | null> => {
      toast.info('Image generation API not configured yet. Connect a Google AI Studio API key in Settings.')
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-images', user.id] })
      queryClient.invalidateQueries({ queryKey: ['ai-usage', user.id] })
    },
  })

  return generate
}

export function useImageGallery() {
  const { user } = useAuth()

  const query = useQuery({
    queryKey: ['ai-images', user.id],
    queryFn: async (): Promise<GeneratedImage[]> => {
      const { data, error } = await supabase.storage
        .from('ai-images')
        .list(user.id, {
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (error || !data) return []

      return data
        .filter((f: { name: string }) => f.name !== '.emptyFolderPlaceholder')
        .map((file: { name: string; created_at?: string }) => {
          const { data: urlData } = supabase.storage
            .from('ai-images')
            .getPublicUrl(`${user.id}/${file.name}`)

          return {
            name: file.name,
            url: urlData.publicUrl,
            created_at: file.created_at ?? '',
          }
        })
    },
  })

  return {
    images: query.data ?? [],
    isLoading: query.isLoading,
  }
}

export function useImageUsage() {
  const { user } = useAuth()
  const today = new Date().toISOString().slice(0, 10)

  const query = useQuery({
    queryKey: ['ai-usage', user.id, 'image_generation', today],
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase
        .from('ai_usage')
        .select('message_count')
        .eq('user_id', user.id)
        .eq('date', today)

      if (error || !data || data.length === 0) return 0

      // Sum counts for today (image usage shares the table)
      return data.reduce((sum: number, row: { message_count: number }) => sum + row.message_count, 0)
    },
  })

  const dailyLimit = 10

  return {
    used: query.data ?? 0,
    remaining: Math.max(0, dailyLimit - (query.data ?? 0)),
    limit: dailyLimit,
    isLoading: query.isLoading,
  }
}
