"use client"

import { cn } from "@/lib/utils"

interface CharCounterProps {
  current: number
  max: number
  className?: string
}

export function CharCounter({ current, max, className }: CharCounterProps) {
  const percentage = (current / max) * 100
  const isNearLimit = percentage >= 90
  const isOverLimit = current > max

  return (
    <div
      className={cn(
        "text-xs transition-colors duration-200",
        isOverLimit && "text-red-500",
        isNearLimit && !isOverLimit && "text-yellow-500",
        !isNearLimit && !isOverLimit && "text-gray-500",
        className
      )}
    >
      {current.toLocaleString()} / {max.toLocaleString()}
    </div>
  )
}