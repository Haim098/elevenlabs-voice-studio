"use client"

import { RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useVoiceSettingsStore } from "@/stores/voice-settings-store"
import { DEFAULT_VOICE_SETTINGS } from "@/lib/constants"

interface VoiceSettingsPanelProps {
  className?: string
}

export function VoiceSettingsPanel({ className }: VoiceSettingsPanelProps) {
  const {
    stability,
    similarityBoost,
    style,
    useSpeakerBoost,
    speed,
    setStability,
    setSimilarityBoost,
    setStyle,
    setUseSpeakerBoost,
    setSpeed,
    resetToDefaults
  } = useVoiceSettingsStore()

  return (
    <div
      className={cn(
        "rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10",
        "dark:bg-white/5 dark:border-white/10 p-6 space-y-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Voice Settings</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetToDefaults}
          className="text-xs hover:bg-white/10"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="stability" className="text-sm">
              Stability
            </Label>
            <span className="text-xs text-gray-500">{stability.toFixed(2)}</span>
          </div>
          <Slider
            id="stability"
            min={0}
            max={1}
            step={0.01}
            value={[stability]}
            onValueChange={([value]) => setStability(value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Controls the consistency of the voice
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="similarity" className="text-sm">
              Similarity Boost
            </Label>
            <span className="text-xs text-gray-500">{similarityBoost.toFixed(2)}</span>
          </div>
          <Slider
            id="similarity"
            min={0}
            max={1}
            step={0.01}
            value={[similarityBoost]}
            onValueChange={([value]) => setSimilarityBoost(value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Increases similarity to the original voice
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="style" className="text-sm">
              Style
            </Label>
            <span className="text-xs text-gray-500">{style.toFixed(2)}</span>
          </div>
          <Slider
            id="style"
            min={0}
            max={1}
            step={0.01}
            value={[style]}
            onValueChange={([value]) => setStyle(value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Enhances the style and emotion of the voice
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="speed" className="text-sm">
              Speed
            </Label>
            <span className="text-xs text-gray-500">{speed.toFixed(2)}x</span>
          </div>
          <Slider
            id="speed"
            min={0.25}
            max={4}
            step={0.05}
            value={[speed]}
            onValueChange={([value]) => setSpeed(value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Adjusts the speaking speed
          </p>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="speaker-boost" className="text-sm">
              Speaker Boost
            </Label>
            <p className="text-xs text-gray-500">
              Enhances voice clarity
            </p>
          </div>
          <Switch
            id="speaker-boost"
            checked={useSpeakerBoost}
            onCheckedChange={setUseSpeakerBoost}
          />
        </div>
      </div>
    </div>
  )
}