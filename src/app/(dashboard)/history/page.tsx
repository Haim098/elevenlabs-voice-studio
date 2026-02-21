"use client"

import { motion } from "framer-motion"
import { HistoryList } from "@/components/history/history-list"
import { useGenerationHistory } from "@/hooks/use-generation-history"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import { GenerationHistoryItem } from "@/types/history"

export default function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useGenerationHistory()
  const { playAudio, currentTrack } = useAudioPlayer()

  const handlePlay = (item: GenerationHistoryItem) => {
    if (item.audioUrl) {
      playAudio(item.id, item.audioUrl, item.text, item.voiceName)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            Generation History
          </h1>
          <p className="text-gray-500 mt-2">
            View and manage your previously generated audio
          </p>
        </div>

        <HistoryList
          history={history}
          playingId={currentTrack?.id}
          onPlay={handlePlay}
          onRemove={removeFromHistory}
          onClear={clearHistory}
        />
      </div>
    </motion.div>
  )
}