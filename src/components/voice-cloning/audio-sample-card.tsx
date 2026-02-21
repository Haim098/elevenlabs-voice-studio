"use client"

import { useEffect, useState } from "react"
import { X, Music } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { formatFileSize, formatDuration, getAudioDuration } from "@/lib/audio-utils"

interface AudioSampleCardProps {
  file: File
  onRemove: () => void
  className?: string
}

export function AudioSampleCard({
  file,
  onRemove,
  className
}: AudioSampleCardProps) {
  const [duration, setDuration] = useState<number>(0)

  useEffect(() => {
    getAudioDuration(file).then(setDuration).catch(console.error)
  }, [file])

  return (
    <div
      className={cn(
        "rounded-xl backdrop-blur-xl bg-white/5 border border-white/10",
        "dark:bg-white/5 dark:border-white/10 p-4",
        "flex items-center gap-4",
        className
      )}
    >
      <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center">
        <Music className="w-6 h-6 text-violet-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{formatFileSize(file.size)}</span>
          {duration > 0 && (
            <>
              <span>•</span>
              <span>{formatDuration(duration)}</span>
            </>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-8 hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}