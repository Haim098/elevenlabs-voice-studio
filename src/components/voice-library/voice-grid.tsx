"use client"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { VoiceCard } from "./voice-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Mic } from "lucide-react"
import { Voice } from "@/types/voice"

interface VoiceGridProps {
  voices: Voice[]
  isLoading?: boolean
  onPlayVoice?: (voiceId: string) => void
  className?: string
}

export function VoiceGrid({
  voices,
  isLoading,
  onPlayVoice,
  className
}: VoiceGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
          className
        )}
      >
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl bg-white/5" />
        ))}
      </div>
    )
  }

  if (voices.length === 0) {
    return (
      <EmptyState
        icon={Mic}
        title="No voices found"
        description="Try adjusting your search or filters"
        className="py-20"
      />
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
        className
      )}
    >
      {voices.map((voice) => (
        <VoiceCard
          key={voice.voiceId}
          voice={voice}
          onPlay={onPlayVoice}
        />
      ))}
    </div>
  )
}