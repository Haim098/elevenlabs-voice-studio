"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, Info } from "lucide-react"

interface EmotionTagToolbarProps {
  onInsertTag: (tag: string) => void
  className?: string
}

const EMOTION_CATEGORIES = [
  {
    label: "Emotions",
    tags: [
      { tag: "[happy]", desc: "Joyful, upbeat tone" },
      { tag: "[sad]", desc: "Somber, melancholic tone" },
      { tag: "[excited]", desc: "High energy, enthusiastic" },
      { tag: "[angry]", desc: "Frustrated, intense" },
      { tag: "[scared]", desc: "Fearful, anxious tone" },
      { tag: "[surprised]", desc: "Shocked, astonished" },
      { tag: "[curious]", desc: "Inquisitive, wondering" },
      { tag: "[sarcastic]", desc: "Ironic, mocking tone" },
      { tag: "[mischievously]", desc: "Playful, sneaky" },
      { tag: "[elated]", desc: "Overjoyed, thrilled" },
      { tag: "[crying]", desc: "Tearful, emotional" },
    ],
  },
  {
    label: "Delivery",
    tags: [
      { tag: "[whispers]", desc: "Quiet, intimate whisper" },
      { tag: "[shouts]", desc: "Loud, projecting voice" },
      { tag: "[cautiously]", desc: "Careful, hesitant" },
      { tag: "[confidently]", desc: "Bold, self-assured" },
      { tag: "[nervously]", desc: "Anxious, shaky" },
      { tag: "[dramatically]", desc: "Theatrical delivery" },
      { tag: "[indecisive]", desc: "Uncertain, wavering" },
      { tag: "[quizzically]", desc: "Questioning tone" },
    ],
  },
  {
    label: "Sounds",
    tags: [
      { tag: "[laughs]", desc: "Light laughter" },
      { tag: "[laughs harder]", desc: "Intense laughter" },
      { tag: "[sighs]", desc: "Exhale of relief/resignation" },
      { tag: "[gasps]", desc: "Sharp intake of breath" },
      { tag: "[clears throat]", desc: "Throat clearing" },
      { tag: "[snorts]", desc: "Amused snort" },
    ],
  },
  {
    label: "Pauses",
    tags: [
      { tag: '<break time="0.5s" />', desc: "Short pause (0.5s)" },
      { tag: '<break time="1.0s" />', desc: "Medium pause (1s)" },
      { tag: '<break time="1.5s" />', desc: "Long pause (1.5s)" },
      { tag: '<break time="2.0s" />', desc: "Extra long pause (2s)" },
    ],
  },
  {
    label: "Accents",
    tags: [
      { tag: "[strong British accent]", desc: "British English accent" },
      { tag: "[strong French accent]", desc: "French accent" },
      { tag: "[strong Southern accent]", desc: "Southern US accent" },
      { tag: "[strong Australian accent]", desc: "Australian accent" },
    ],
  },
]

export function EmotionTagToolbar({
  onInsertTag,
  className,
}: EmotionTagToolbarProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const allTags = EMOTION_CATEGORIES.flatMap((cat) => cat.tags)
  const filteredCategories = search.trim()
    ? [
        {
          label: "Search Results",
          tags: allTags.filter(
            (t) =>
              t.tag.toLowerCase().includes(search.toLowerCase()) ||
              t.desc.toLowerCase().includes(search.toLowerCase())
          ),
        },
      ]
    : EMOTION_CATEGORIES

  // Quick access tags (most used)
  const quickTags = [
    "[happy]",
    "[sad]",
    "[excited]",
    "[whispers]",
    "[laughs]",
    "[sighs]",
    "[sarcastic]",
    "[angry]",
  ]

  return (
    <div className={cn("space-y-2", className)}>
      {/* Quick Tags Row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {quickTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onInsertTag(tag + " ")}
            className={cn(
              "px-2 py-0.5 rounded-md text-[11px] font-medium transition-all",
              "bg-violet-500/15 text-violet-400 border border-violet-500/20",
              "hover:bg-violet-500/25 hover:border-violet-500/40 cursor-pointer"
            )}
          >
            {tag.replace(/[[\]]/g, "")}
          </button>
        ))}

        {/* More Tags Popover */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "px-2 py-0.5 rounded-md text-[11px] font-medium transition-all",
                "bg-white/5 text-muted-foreground border border-white/10",
                "hover:bg-white/10 cursor-pointer flex items-center gap-1"
              )}
            >
              More
              <ChevronDown className="w-3 h-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[340px] p-0 bg-black/95 backdrop-blur-xl border-white/10"
            align="start"
          >
            <div className="p-3 border-b border-white/10">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search emotion tags..."
                className="h-8 bg-white/5 border-white/10 text-sm"
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredCategories.map((category) => (
                <div key={category.label} className="mb-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">
                    {category.label}
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {category.tags.map((item) => (
                      <button
                        key={item.tag}
                        onClick={() => {
                          onInsertTag(item.tag + " ")
                          setOpen(false)
                          setSearch("")
                        }}
                        className={cn(
                          "text-left px-2 py-1.5 rounded-md text-xs transition-all",
                          "hover:bg-violet-500/20 cursor-pointer group"
                        )}
                      >
                        <span className="font-medium text-violet-400 group-hover:text-violet-300">
                          {item.tag.replace(/[<[\]/>]/g, "").replace(/ time=".*?"/, "")}
                        </span>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                          {item.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Info tooltip */}
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <Info className="w-3 h-3" />
        <span>
          Click a tag to insert it before selected text. Works best with{" "}
          <span className="text-violet-400">ElevenLabs v3</span> model.
        </span>
      </div>
    </div>
  )
}
