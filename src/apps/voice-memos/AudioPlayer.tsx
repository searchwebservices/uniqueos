import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause } from 'lucide-react'
import { formatDuration } from './utils'

interface Props {
  url: string
  totalDuration: number | null
}

export function AudioPlayer({ url, totalDuration }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(totalDuration ?? 0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(Math.floor(audio.currentTime))
    const handleDurationChange = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(Math.floor(audio.duration))
      }
    }
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      await audio.play()
      setIsPlaying(true)
    }
  }, [isPlaying])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const time = Number(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <audio ref={audioRef} src={url} preload="metadata" />

      <button
        onClick={togglePlay}
        className="w-7 h-7 flex items-center justify-center rounded-full shrink-0 transition-colors"
        style={{
          background: 'var(--color-accent)',
        }}
      >
        {isPlaying ? (
          <Pause size={12} color="white" />
        ) : (
          <Play size={12} color="white" className="ml-0.5" />
        )}
      </button>

      <input
        type="range"
        min={0}
        max={duration || 1}
        value={currentTime}
        onChange={handleSeek}
        className="flex-1 h-1 accent-[var(--color-accent)]"
      />

      <span
        className="text-[10px] font-mono tabular-nums shrink-0"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        {formatDuration(currentTime)} / {formatDuration(duration)}
      </span>
    </div>
  )
}
