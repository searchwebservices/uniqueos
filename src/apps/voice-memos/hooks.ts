import { useState, useRef, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from 'sonner'
import type { DbVoiceMemo } from '@/types/database'

const QUERY_KEY = 'voice-memos'

export function useVoiceMemos() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [QUERY_KEY, user.id],
    queryFn: async (): Promise<DbVoiceMemo[]> => {
      const { data, error } = await supabase
        .from('voice_memos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data ?? []
    },
  })

  const createMemo = useMutation({
    mutationFn: async (input: {
      title: string
      storage_path: string
      duration_seconds: number | null
    }): Promise<DbVoiceMemo> => {
      const now = new Date().toISOString()
      const record = {
        id: crypto.randomUUID(),
        user_id: user.id,
        title: input.title,
        storage_path: input.storage_path,
        duration_seconds: input.duration_seconds,
        transcript: null,
        transcript_status: 'pending' as const,
        created_at: now,
        updated_at: now,
      }

      const { error } = await supabase.from('voice_memos').insert(record)
      if (error) throw error
      return record
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const updateMemo = useMutation({
    mutationFn: async (input: { id: string } & Partial<Pick<DbVoiceMemo, 'title' | 'transcript' | 'transcript_status'>>) => {
      const { id, ...updates } = input
      const now = new Date().toISOString()
      const { error } = await supabase
        .from('voice_memos')
        .update({ ...updates, updated_at: now })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  const deleteMemo = useMutation({
    mutationFn: async (memo: DbVoiceMemo) => {
      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('voice-memos')
        .remove([memo.storage_path])

      if (storageError) {
        console.warn('Failed to delete storage file:', storageError)
      }

      const { error } = await supabase
        .from('voice_memos')
        .delete()
        .eq('id', memo.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  return {
    memos: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createMemo,
    updateMemo,
    deleteMemo,
  }
}

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [blob, setBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(0)

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Prefer webm/opus, fall back to whatever is available
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : undefined

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)

      chunksRef.current = []
      setBlob(null)

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        const finalBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        })
        setBlob(finalBlob)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = recorder
      recorder.start(250) // Collect data every 250ms
      setIsRecording(true)
      startTimeRef.current = Date.now()
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 500)
    } catch {
      toast.error('Microphone access denied')
    }
  }, [])

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    setBlob(null)
    setDuration(0)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  return {
    isRecording,
    duration,
    blob,
    start,
    stop,
    reset,
  }
}

export function useTranscription(memoId: string) {
  const queryClient = useQueryClient()

  const transcribe = useMutation({
    mutationFn: async () => {
      toast.info('Transcription engine loading... WebGPU Whisper integration coming soon.')
      // Placeholder — will integrate with WebGPU Whisper
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })

  // memoId used to scope the mutation context
  void memoId

  return transcribe
}
