"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { nanoid } from "nanoid"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { VoiceSelector } from "./voice-selector"
import { ModelSelector } from "./model-selector"
import { EmotionTagToolbar } from "./emotion-tag-toolbar"
import { CharCounter } from "@/components/shared/char-counter"
import { useVoiceSettingsStore } from "@/stores/voice-settings-store"
import { useTts } from "@/hooks/use-tts"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import { useGenerationHistory } from "@/hooks/use-generation-history"
import { useVoices } from "@/hooks/use-voices"
import { MAX_TEXT_LENGTH, MODELS } from "@/lib/constants"

interface TtsFormProps {
  className?: string
}

export function TtsForm({ className }: TtsFormProps) {
  const [text, setText] = useState("")
  const [selectedVoiceId, setSelectedVoiceId] = useState("")
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { voices, isLoading: voicesLoading } = useVoices()
  const { generate, isGenerating, audioUrl } = useTts()
  const { playAudio } = useAudioPlayer()
  const { addToHistory } = useGenerationHistory()
  const voiceSettings = useVoiceSettingsStore()
  const prevAudioUrl = useRef<string | null>(null)

  // Play audio when it's generated
  useEffect(() => {
    if (audioUrl && audioUrl !== prevAudioUrl.current) {
      prevAudioUrl.current = audioUrl
      const selectedVoice = voices.find((v) => v.voiceId === selectedVoiceId)
      const voiceName = selectedVoice?.name || "Unknown Voice"
      const audioId = nanoid()
      playAudio(audioId, audioUrl, text.slice(0, 50), voiceName)
      addToHistory({
        id: audioId,
        type: "tts",
        text,
        voiceName,
        voiceId: selectedVoiceId,
        modelId: selectedModel,
        audioUrl,
        timestamp: Date.now(),
        duration: 0,
      })
    }
  }, [audioUrl, voices, selectedVoiceId, selectedModel, text, playAudio, addToHistory])

  // Insert emotion tag at cursor position in textarea
  const handleInsertTag = useCallback(
    (tag: string) => {
      const textarea = textareaRef.current
      if (!textarea) {
        setText((prev) => prev + tag)
        return
      }

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = text.substring(start, end)

      let newText: string
      if (selectedText) {
        // Wrap selected text with tag
        newText = text.substring(0, start) + tag + selectedText + text.substring(end)
      } else {
        // Insert tag at cursor
        newText = text.substring(0, start) + tag + text.substring(end)
      }

      setText(newText)

      // Restore cursor position after tag
      requestAnimationFrame(() => {
        const newPos = start + tag.length + (selectedText ? selectedText.length : 0)
        textarea.focus()
        textarea.setSelectionRange(newPos, newPos)
      })
    },
    [text]
  )

  const handleSubmit = () => {
    if (!text.trim() || !selectedVoiceId) {
      toast.error("Please enter text and select a voice")
      return
    }

    if (text.length > MAX_TEXT_LENGTH) {
      toast.error(
        `Text must be less than ${MAX_TEXT_LENGTH.toLocaleString()} characters`
      )
      return
    }

    generate(
      {
        text,
        voiceId: selectedVoiceId,
        modelId: selectedModel,
        outputFormat: voiceSettings.outputFormat,
        stability: voiceSettings.stability,
        similarityBoost: voiceSettings.similarityBoost,
        style: voiceSettings.style,
        speed: voiceSettings.speed,
        useSpeakerBoost: voiceSettings.useSpeakerBoost,
      },
      {
        onSuccess: () => {
          toast.success("Speech generated successfully!")
        },
        onError: () => {
          toast.error("Failed to generate speech")
        },
      }
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-4">
        <VoiceSelector
          value={selectedVoiceId}
          onValueChange={setSelectedVoiceId}
          voices={voices}
          className="flex-1"
        />
        <ModelSelector
          value={selectedModel}
          onValueChange={setSelectedModel}
          className="w-[200px]"
        />
      </div>

      {/* Emotion Tags */}
      <div className="space-y-1.5">
        <Label className="text-sm">Emotion Tags</Label>
        <EmotionTagToolbar onInsertTag={handleInsertTag} />
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Enter text to convert to speech...

Try adding emotion tags like:
[excited] Wow, this is amazing!
[whispers] I have a secret to tell you...
[laughs] That was so funny!`}
          className={cn(
            "min-h-[200px] resize-none font-mono text-sm",
            "bg-white/5 backdrop-blur-xl border-white/10",
            "dark:bg-white/5 dark:border-white/10",
            "focus:border-violet-500 dark:focus:border-violet-500",
            "placeholder:text-gray-500"
          )}
          disabled={isGenerating}
        />
        <div className="flex justify-end">
          <CharCounter current={text.length} max={MAX_TEXT_LENGTH} />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={
          isGenerating || !text.trim() || !selectedVoiceId || voicesLoading
        }
        className={cn(
          "w-full bg-gradient-to-r from-violet-600 to-blue-600",
          "hover:from-violet-700 hover:to-blue-700",
          "text-white font-medium h-12",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isGenerating && "animate-pulse"
        )}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating Speech...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Speech
          </>
        )}
      </Button>
    </div>
  )
}
