"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VoiceSelector } from "@/components/studio/voice-selector"
import { DialogueLine } from "@/types/dialogue"
import { Voice } from "@/types/voice"

interface DialogueLineProps {
  line: DialogueLine
  voices: Voice[]
  index: number
  onChange: (line: DialogueLine) => void
  onRemove: () => void
  className?: string
}

export function DialogueLineComponent({
  line,
  voices,
  index,
  onChange,
  onRemove,
  className
}: DialogueLineProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl",
        "bg-white/5 backdrop-blur-xl border border-white/10",
        "dark:bg-white/5 dark:border-white/10",
        className
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 text-sm font-medium">
        {index + 1}
      </div>

      <VoiceSelector
        value={line.voiceId}
        onValueChange={(voiceId) => onChange({ ...line, voiceId })}
        voices={voices}
        className="w-[200px]"
      />

      <Input
        value={line.text}
        onChange={(e) => onChange({ ...line, text: e.target.value })}
        placeholder={`Speaker ${index + 1} text...`}
        className={cn(
          "flex-1 bg-white/5 border-white/10",
          "dark:bg-white/5 dark:border-white/10",
          "focus:border-violet-500 dark:focus:border-violet-500"
        )}
      />

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