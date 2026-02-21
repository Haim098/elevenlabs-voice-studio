"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { nanoid } from "nanoid"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DialogueLineComponent } from "./dialogue-line"
import { useDialogue } from "@/hooks/use-dialogue"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import { useGenerationHistory } from "@/hooks/use-generation-history"
import { DialogueLine } from "@/types/dialogue"
import { Voice } from "@/types/voice"

interface DialogueEditorProps {
  voices: Voice[]
  className?: string
}

export function DialogueEditor({ voices, className }: DialogueEditorProps) {
  const [lines, setLines] = useState<DialogueLine[]>([
    { id: nanoid(), voiceId: "", text: "" },
    { id: nanoid(), voiceId: "", text: "" }
  ])

  const { generate, isGenerating, audioUrl } = useDialogue()
  const { playAudio } = useAudioPlayer()
  const { addToHistory } = useGenerationHistory()
  const prevAudioUrl = useRef<string | null>(null)

  useEffect(() => {
    if (audioUrl && audioUrl !== prevAudioUrl.current) {
      prevAudioUrl.current = audioUrl
      const audioId = nanoid()
      const textPreview = lines
        .map((line, i) => `Speaker ${i + 1}: ${line.text.slice(0, 40)}`)
        .join(" | ")
      playAudio(audioId, audioUrl, textPreview, "Multi-voice Dialogue")
      addToHistory({
        id: audioId,
        type: "dialogue",
        text: textPreview,
        voiceName: "Multi-voice",
        voiceId: "",
        modelId: "",
        audioUrl,
        timestamp: Date.now(),
        duration: 0,
      })
    }
  }, [audioUrl, lines, playAudio, addToHistory])

  const handleAddLine = () => {
    setLines([...lines, { id: nanoid(), voiceId: "", text: "" }])
  }

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 1) {
      toast.error("You need at least one dialogue line")
      return
    }
    setLines(lines.filter((_, i) => i !== index))
  }

  const handleUpdateLine = (index: number, updatedLine: DialogueLine) => {
    const newLines = [...lines]
    newLines[index] = updatedLine
    setLines(newLines)
  }

  const handleGenerate = async () => {
    // Validate all lines
    const invalidLines = lines.filter(line => !line.voiceId || !line.text.trim())
    if (invalidLines.length > 0) {
      toast.error("Please fill in all dialogue lines with voice and text")
      return
    }

    generate(
      {
        inputs: lines.map((line) => ({
          text: line.text,
          voiceId: line.voiceId,
        })),
      },
      {
        onSuccess: () => {
          toast.success("Dialogue generated successfully!")
        },
        onError: () => {
          toast.error("Failed to generate dialogue")
        },
      }
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        {lines.map((line, index) => (
          <DialogueLineComponent
            key={line.id}
            line={line}
            voices={voices}
            index={index}
            onChange={(updatedLine) => handleUpdateLine(index, updatedLine)}
            onRemove={() => handleRemoveLine(index)}
          />
        ))}
      </div>

      <Button
        onClick={handleAddLine}
        variant="outline"
        className="w-full bg-white/5 border-white/10 hover:bg-white/10"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Speaker
      </Button>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || lines.length === 0}
        className={cn(
          "w-full bg-gradient-to-r from-violet-600 to-blue-600",
          "hover:from-violet-700 hover:to-blue-700",
          "text-white font-medium",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isGenerating && "animate-pulse"
        )}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating Dialogue...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Dialogue
          </>
        )}
      </Button>
    </div>
  )
}