"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Voice } from "@/types/voice"

interface VoiceCardProps {
  voice: Voice
  onPlay?: (voiceId: string) => void
  className?: string
}

export function VoiceCard({ voice, onPlay, className }: VoiceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const handlePlayPreview = () => {
    if (!voice.previewUrl) {
      onPlay?.(voice.voiceId)
      return
    }

    if (isPlaying && audio) {
      audio.pause()
      setIsPlaying(false)
    } else {
      const audioElement = new Audio(voice.previewUrl)
      audioElement.addEventListener("ended", () => setIsPlaying(false))
      audioElement.play()
      setAudio(audioElement)
      setIsPlaying(true)
    }
  }

  const truncatedDescription = voice.description
    ? voice.description.length > 100
      ? voice.description.slice(0, 100) + "..."
      : voice.description
    : "No description available"

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10",
        "dark:bg-white/5 dark:border-white/10 p-6 space-y-4",
        "hover:bg-white/10 dark:hover:bg-white/10 transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <h4 className="font-medium">{voice.name}</h4>
            {voice.category && (
              <Badge variant="secondary" className="mt-1 text-xs">
                {voice.category}
              </Badge>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayPreview}
          className="h-8 w-8 hover:bg-white/10"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
      </div>

      <p className="text-sm text-gray-400 line-clamp-3">
        {truncatedDescription}
      </p>

      {voice.labels && Object.keys(voice.labels).length > 0 && (
        <div className="flex flex-wrap gap-1">
          {Object.entries(voice.labels).slice(0, 3).map(([key, value]) => (
            <Badge
              key={key}
              variant="outline"
              className="text-xs border-white/20"
            >
              {key}: {value}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  )
}