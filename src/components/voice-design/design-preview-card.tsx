"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DesignPreviewCardProps {
  preview: {
    generatedVoiceId?: string
    generated_voice_id?: string
    audioBase64?: string
    audio_base_64?: string
  }
  index: number
  className?: string
}

export function DesignPreviewCard({
  preview,
  index,
  className
}: DesignPreviewCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const voiceId = preview.generatedVoiceId || preview.generated_voice_id
  const base64Audio = preview.audioBase64 || preview.audio_base_64

  useEffect(() => {
    if (!base64Audio) return

    // Convert base64 to blob URL
    const byteCharacters = atob(base64Audio)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: "audio/mpeg" })
    const url = URL.createObjectURL(blob)

    setAudioUrl(url)

    const audioElement = new Audio(url)
    audioElement.addEventListener("ended", () => setIsPlaying(false))
    setAudio(audioElement)

    return () => {
      URL.revokeObjectURL(url)
      audioElement.pause()
      audioElement.src = ""
    }
  }, [base64Audio])

  const handlePlayPause = () => {
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10",
        "dark:bg-white/5 dark:border-white/10 p-6 space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Preview {index + 1}</h4>
        <div className="text-xs text-gray-500">
          ID: {voiceId?.slice(0, 8)}...
        </div>
      </div>

      <div className="h-20 rounded-lg bg-black/20 dark:bg-white/5 flex items-center justify-center">
        <div className="flex gap-1">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1 bg-violet-500 rounded-full transition-all duration-300",
                isPlaying ? "animate-pulse" : "opacity-50"
              )}
              style={{
                height: `${20 + Math.random() * 40}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handlePlayPause}
          variant="outline"
          size="sm"
          className="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Play
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 hover:bg-white/10"
          title="Save Voice"
        >
          <Save className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}