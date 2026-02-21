"use client"

import { RotateCcw, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useVoiceSettingsStore } from "@/stores/voice-settings-store"

interface VoiceSettingsPanelProps {
  className?: string
}

const EMOTION_PRESETS = [
  {
    name: "Neutral",
    emoji: "",
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0,
    speed: 1,
  },
  {
    name: "Expressive",
    emoji: "",
    stability: 0.3,
    similarityBoost: 0.75,
    style: 0.6,
    speed: 1,
  },
  {
    name: "Calm",
    emoji: "",
    stability: 0.8,
    similarityBoost: 0.8,
    style: 0.1,
    speed: 0.9,
  },
  {
    name: "Dramatic",
    emoji: "",
    stability: 0.15,
    similarityBoost: 0.7,
    style: 0.9,
    speed: 0.95,
  },
  {
    name: "Energetic",
    emoji: "",
    stability: 0.25,
    similarityBoost: 0.75,
    style: 0.5,
    speed: 1.15,
  },
  {
    name: "Soft",
    emoji: "",
    stability: 0.7,
    similarityBoost: 0.85,
    style: 0.2,
    speed: 0.85,
  },
]

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
    resetToDefaults,
  } = useVoiceSettingsStore()

  const applyPreset = (preset: (typeof EMOTION_PRESETS)[number]) => {
    setStability(preset.stability)
    setSimilarityBoost(preset.similarityBoost)
    setStyle(preset.style)
    setSpeed(preset.speed)
  }

  return (
    <div
      className={cn(
        "rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10",
        "dark:bg-white/5 dark:border-white/10 p-6 space-y-5",
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

      {/* Emotion Presets */}
      <div className="space-y-2">
        <Label className="text-sm flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          Emotion Presets
        </Label>
        <div className="grid grid-cols-3 gap-1.5">
          {EMOTION_PRESETS.map((preset) => {
            const isActive =
              Math.abs(stability - preset.stability) < 0.05 &&
              Math.abs(style - preset.style) < 0.05 &&
              Math.abs(speed - preset.speed) < 0.05
            return (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={cn(
                  "px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
                  "border cursor-pointer",
                  isActive
                    ? "bg-violet-600/30 border-violet-500/50 text-violet-300"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                )}
              >
                {preset.name}
              </button>
            )
          })}
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Fine-tune Sliders */}
      <div className="space-y-4">
        {/* Stability */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="stability" className="text-sm">
              Stability
            </Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {stability.toFixed(2)}
            </span>
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
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>More emotional</span>
            <span>More stable</span>
          </div>
        </div>

        {/* Similarity Boost */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="similarity" className="text-sm">
              Clarity + Similarity
            </Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {similarityBoost.toFixed(2)}
            </span>
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
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>More varied</span>
            <span>More similar</span>
          </div>
        </div>

        {/* Style Exaggeration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="style" className="text-sm">
              Style Exaggeration
            </Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {style.toFixed(2)}
            </span>
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
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Subtle</span>
            <span>Highly expressive</span>
          </div>
        </div>

        {/* Speed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="speed" className="text-sm">
              Speed
            </Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {speed.toFixed(2)}x
            </span>
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
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0.25x slow</span>
            <span>1x normal</span>
            <span>4x fast</span>
          </div>
        </div>

        {/* Speaker Boost */}
        <div className="flex items-center justify-between py-1">
          <div className="space-y-0.5">
            <Label htmlFor="speaker-boost" className="text-sm">
              Speaker Boost
            </Label>
            <p className="text-[10px] text-muted-foreground">
              Enhances clarity and voice similarity
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
