"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { VoiceSearchBar } from "@/components/voice-library/voice-search-bar"
import { VoiceGrid } from "@/components/voice-library/voice-grid"
import { useVoices } from "@/hooks/use-voices"
import { useAudioPlayer } from "@/hooks/use-audio-player"

export default function VoiceLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const { voices, isLoading } = useVoices()
  const { playAudio } = useAudioPlayer()

  // Filter voices based on search and filter
  const filteredVoices = useMemo(() => {
    let filtered = voices

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        voice =>
          voice.name.toLowerCase().includes(query) ||
          voice.description?.toLowerCase().includes(query) ||
          voice.category?.toLowerCase().includes(query)
      )
    }

    // Apply filter
    if (filter !== "all") {
      filtered = filtered.filter(voice => {
        switch (filter) {
          case "cloned":
            return voice.category === "cloned"
          case "premade":
            return voice.category === "premade" || voice.category === "pre-made"
          case "professional":
            return voice.category === "professional"
          case "community":
            return voice.category === "community"
          default:
            return true
        }
      })
    }

    return filtered
  }, [voices, searchQuery, filter])

  const handlePlayVoice = (voiceId: string) => {
    const voice = voices.find(v => v.voiceId === voiceId)
    if (voice?.previewUrl) {
      playAudio(
        voiceId,
        voice.previewUrl,
        `${voice.name} preview`,
        voice.name
      )
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full filter blur-3xl opacity-10" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            Voice Library
          </h1>
          <p className="text-gray-500 mt-2">
            Explore and preview all available voices
          </p>
        </div>

        <div className="space-y-6">
          <VoiceSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onFilterChange={setFilter}
          />

          <VoiceGrid
            voices={filteredVoices}
            isLoading={isLoading}
            onPlayVoice={handlePlayVoice}
          />
        </div>
      </div>
    </motion.div>
  )
}