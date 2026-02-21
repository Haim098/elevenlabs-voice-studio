"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Voice } from "@/types/voice"

interface VoiceSelectorProps {
  value: string
  onValueChange: (value: string) => void
  voices: Voice[]
  className?: string
}

export function VoiceSelector({
  value,
  onValueChange,
  voices,
  className,
}: VoiceSelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedVoice = voices.find((voice) => voice.voiceId === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between bg-white/5 backdrop-blur-xl border-white/10",
            "dark:bg-white/5 dark:border-white/10",
            "hover:bg-white/10 dark:hover:bg-white/10",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <Mic className="w-4 h-4 text-violet-500 shrink-0" />
            <span className="truncate">
              {selectedVoice ? selectedVoice.name : "Select voice..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 bg-black/90 backdrop-blur-xl border-white/10">
        <Command filter={(value, search) => {
          if (value.toLowerCase().includes(search.toLowerCase())) return 1
          return 0
        }}>
          <CommandInput
            placeholder="Search voices..."
            className="border-0 focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>No voice found.</CommandEmpty>
            {voices.map((voice, index) => (
              <CommandItem
                key={voice.voiceId}
                value={`${voice.name} ${voice.voiceId}`}
                onSelect={() => {
                  onValueChange(
                    voice.voiceId === value ? "" : voice.voiceId
                  )
                  setOpen(false)
                }}
                className="cursor-pointer hover:bg-white/10"
              >
                <Check
                  className={cn(
                    "h-4 w-4 shrink-0",
                    value === voice.voiceId ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="truncate flex-1">{voice.name}</span>
                {voice.category && (
                  <Badge variant="secondary" className="text-[10px] shrink-0 ml-1">
                    {voice.category}
                  </Badge>
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
