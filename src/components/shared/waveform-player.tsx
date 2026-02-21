"use client"

import { useEffect, useRef } from "react"
import WaveSurfer from "wavesurfer.js"
import { cn } from "@/lib/utils"

interface WaveformPlayerProps {
  audioUrl: string
  height?: number
  isPlaying?: boolean
  onReady?: () => void
  onPlay?: () => void
  onPause?: () => void
  className?: string
}

export function WaveformPlayer({
  audioUrl,
  height = 48,
  isPlaying = false,
  onReady,
  onPlay,
  onPause,
  className
}: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return

    // Create WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#6b7280",
      progressColor: "#8b5cf6",
      cursorColor: "#8b5cf6",
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: height,
      barGap: 3,
      normalize: true,
      interact: true,
      dragToSeek: true,
    })

    wavesurferRef.current = wavesurfer

    // Load audio
    wavesurfer.load(audioUrl)

    // Event handlers
    wavesurfer.on("ready", () => {
      onReady?.()
    })

    wavesurfer.on("play", () => {
      onPlay?.()
    })

    wavesurfer.on("pause", () => {
      onPause?.()
    })

    // Cleanup
    return () => {
      wavesurfer.destroy()
      wavesurferRef.current = null
    }
  }, [audioUrl, height, onReady, onPlay, onPause])

  // Sync play/pause with isPlaying prop
  useEffect(() => {
    if (!wavesurferRef.current) return

    if (isPlaying && !wavesurferRef.current.isPlaying()) {
      wavesurferRef.current.play()
    } else if (!isPlaying && wavesurferRef.current.isPlaying()) {
      wavesurferRef.current.pause()
    }
  }, [isPlaying])

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full rounded-lg overflow-hidden bg-black/20 dark:bg-white/5",
        className
      )}
    />
  )
}