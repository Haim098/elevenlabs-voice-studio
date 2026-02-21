"use client"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MODELS } from "@/lib/constants"

interface ModelSelectorProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function ModelSelector({
  value,
  onValueChange,
  className
}: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "bg-white/5 backdrop-blur-xl border-white/10",
          "dark:bg-white/5 dark:border-white/10",
          "hover:bg-white/10 dark:hover:bg-white/10",
          className
        )}
      >
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10">
        {MODELS.map((model) => (
          <SelectItem
            key={model.id}
            value={model.id}
            className="cursor-pointer hover:bg-white/10"
          >
            <div className="flex flex-col">
              <span className="font-medium">{model.name}</span>
              <span className="text-xs text-gray-500">{model.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}