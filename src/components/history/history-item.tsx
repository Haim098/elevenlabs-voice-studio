"use client"

import { motion } from "framer-motion"
import { Play, Pause, Trash2, Clock, Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GenerationHistoryItem } from "@/types/history"
import { formatDuration } from "@/lib/audio-utils"

interface HistoryItemProps {
  item: GenerationHistoryItem
  isPlaying?: boolean
  onPlay: () => void
  onRemove: () => void
  className?: string
}

export function HistoryItem({
  item,
  isPlaying,
  onPlay,
  onRemove,
  className
}: HistoryItemProps) {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (days === 1) {
      return "Yesterday"
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const truncatedText = item.text.length > 150
    ? item.text.slice(0, 150) + "..."
    : item.text

  const typeColors: Record<string, string> = {
    tts: "bg-violet-500/20 text-violet-400",
    dialogue: "bg-blue-500/20 text-blue-400",
    "voice-design": "bg-green-500/20 text-green-400",
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        "rounded-xl backdrop-blur-xl bg-white/5 border border-white/10",
        "dark:bg-white/5 dark:border-white/10 p-4",
        "hover:bg-white/10 dark:hover:bg-white/10 transition-colors",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlay}
          className="h-10 w-10 hover:bg-white/10 shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn("text-xs", typeColors[item.type])}>
              {item.type.toUpperCase()}
            </Badge>
            <span className="text-sm font-medium">{item.voiceName}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimestamp(item.timestamp)}
            </span>
            {item.duration > 0 && (
              <>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">
                  {formatDuration(item.duration)}
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-gray-400 line-clamp-2">
            {truncatedText}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 hover:bg-red-500/20 hover:text-red-400 shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}