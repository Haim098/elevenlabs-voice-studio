"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { HistoryItem } from "./history-item"
import { EmptyState } from "@/components/shared/empty-state"
import { Clock } from "lucide-react"
import { GenerationHistoryItem } from "@/types/history"

interface HistoryListProps {
  history: GenerationHistoryItem[]
  playingId?: string
  onPlay: (item: GenerationHistoryItem) => void
  onRemove: (id: string) => void
  onClear: () => void
  className?: string
}

export function HistoryList({
  history,
  playingId,
  onPlay,
  onRemove,
  onClear,
  className
}: HistoryListProps) {
  const [showClearDialog, setShowClearDialog] = useState(false)

  if (history.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No generation history"
        description="Your generated audio will appear here"
        className="py-20"
      />
    )
  }

  // Sort by timestamp, most recent first
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Generation History ({history.length})
        </h3>

        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-black/90 backdrop-blur-xl border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove all items from your generation history.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onClear()
                  setShowClearDialog(false)
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-2">
        {sortedHistory.map((item) => (
          <HistoryItem
            key={item.id}
            item={item}
            isPlaying={playingId === item.id}
            onPlay={() => onPlay(item)}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </div>
    </div>
  )
}