"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { WaveformPlayer } from "@/components/shared/waveform-player"

interface GenerationResultProps {
  audioUrl: string
  text: string
  voiceName: string
  className?: string
}

export function GenerationResult({
  audioUrl,
  text,
  voiceName,
  className
}: GenerationResultProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = audioUrl
    link.download = `${voiceName}_${Date.now()}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const truncatedText = text.length > 100 ? text.slice(0, 100) + "..." : text

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10",
        "dark:bg-white/5 dark:border-white/10 p-6 space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Generation Result</h3>
          <p className="text-sm text-gray-500">Voice: {voiceName}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <WaveformPlayer
        audioUrl={audioUrl}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        height={64}
      />

      <div className="pt-2 border-t border-white/10">
        <p className="text-sm text-gray-400 italic">"{truncatedText}"</p>
      </div>
    </motion.div>
  )
}