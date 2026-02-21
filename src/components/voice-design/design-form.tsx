"use client"

import { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useVoiceDesign } from "@/hooks/use-voice-design"
import { DesignPreviewCard } from "./design-preview-card"
import { VOICE_DESIGN_MODELS } from "@/lib/constants"

interface DesignFormProps {
  className?: string
}

export function DesignForm({ className }: DesignFormProps) {
  const [voiceDescription, setVoiceDescription] = useState("")
  const [sampleText, setSampleText] = useState("")
  const [model, setModel] = useState<string>(VOICE_DESIGN_MODELS[0].id)
  const [loudness, setLoudness] = useState(0)
  const [guidanceScale, setGuidanceScale] = useState(5)

  const { design, isDesigning, previews } = useVoiceDesign()

  const handleSubmit = async () => {
    if (!voiceDescription.trim()) {
      toast.error("Please enter a voice description")
      return
    }

    if (!sampleText.trim() || sampleText.length < 100) {
      toast.error("Please enter sample text (at least 100 characters)")
      return
    }

    if (sampleText.length > 1000) {
      toast.error("Sample text must be less than 1000 characters")
      return
    }

    design(
      {
        voiceDescription,
        text: sampleText,
        modelId: model,
        loudness,
        guidanceScale,
      },
      {
        onSuccess: () => {
          toast.success("Voice previews generated successfully!")
        },
        onError: () => {
          toast.error("Failed to generate voice previews")
        },
      }
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <Label htmlFor="voice-description">Voice Description</Label>
        <Textarea
          id="voice-description"
          value={voiceDescription}
          onChange={(e) => setVoiceDescription(e.target.value)}
          placeholder="Describe the voice characteristics you want (e.g., 'A warm, friendly female voice with a slight British accent')"
          className={cn(
            "min-h-[100px] resize-none",
            "bg-white/5 backdrop-blur-xl border-white/10",
            "dark:bg-white/5 dark:border-white/10",
            "focus:border-violet-500 dark:focus:border-violet-500"
          )}
          disabled={isDesigning}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sample-text">Sample Text</Label>
        <Textarea
          id="sample-text"
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          placeholder="Enter text for the voice to speak (100-1000 characters)"
          className={cn(
            "min-h-[150px] resize-none",
            "bg-white/5 backdrop-blur-xl border-white/10",
            "dark:bg-white/5 dark:border-white/10",
            "focus:border-violet-500 dark:focus:border-violet-500"
          )}
          disabled={isDesigning}
        />
        <p className="text-xs text-gray-500 text-right">
          {sampleText.length} / 1000 characters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={model} onValueChange={setModel} disabled={isDesigning}>
            <SelectTrigger
              id="model"
              className="bg-white/5 backdrop-blur-xl border-white/10 dark:bg-white/5 dark:border-white/10"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10">
              {VOICE_DESIGN_MODELS.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="loudness">Loudness</Label>
            <span className="text-xs text-gray-500">{loudness.toFixed(1)}</span>
          </div>
          <Slider
            id="loudness"
            min={-1}
            max={1}
            step={0.1}
            value={[loudness]}
            onValueChange={([value]) => setLoudness(value)}
            disabled={isDesigning}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="guidance">Guidance Scale</Label>
            <span className="text-xs text-gray-500">{guidanceScale}</span>
          </div>
          <Slider
            id="guidance"
            min={1}
            max={10}
            step={0.5}
            value={[guidanceScale]}
            onValueChange={([value]) => setGuidanceScale(value)}
            disabled={isDesigning}
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={
          isDesigning ||
          !voiceDescription.trim() ||
          !sampleText.trim() ||
          sampleText.length < 100
        }
        className={cn(
          "w-full bg-gradient-to-r from-violet-600 to-blue-600",
          "hover:from-violet-700 hover:to-blue-700",
          "text-white font-medium",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isDesigning && "animate-pulse"
        )}
      >
        {isDesigning ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating Voice Previews...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Voice Previews
          </>
        )}
      </Button>

      {previews && previews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {previews.map((preview, index) => (
            <DesignPreviewCard
              key={index}
              preview={preview}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}