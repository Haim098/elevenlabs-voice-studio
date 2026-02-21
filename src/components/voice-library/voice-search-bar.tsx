"use client"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface VoiceSearchBarProps {
  value: string
  onChange: (value: string) => void
  onFilterChange?: (filter: string) => void
  className?: string
}

const filters = [
  { label: "All", value: "all" },
  { label: "Cloned", value: "cloned" },
  { label: "Pre-made", value: "premade" },
  { label: "Professional", value: "professional" },
  { label: "Community", value: "community" }
]

export function VoiceSearchBar({
  value,
  onChange,
  onFilterChange,
  className
}: VoiceSearchBarProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search voices..."
          className={cn(
            "pl-10 bg-white/5 backdrop-blur-xl border-white/10",
            "dark:bg-white/5 dark:border-white/10",
            "focus:border-violet-500 dark:focus:border-violet-500"
          )}
        />
      </div>

      {onFilterChange && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Badge
              key={filter.value}
              variant="outline"
              className={cn(
                "cursor-pointer transition-colors",
                "hover:bg-violet-500/20 hover:border-violet-500"
              )}
              onClick={() => onFilterChange(filter.value)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}