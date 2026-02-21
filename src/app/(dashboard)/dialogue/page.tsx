"use client"

import { motion } from "framer-motion"
import { DialogueEditor } from "@/components/dialogue/dialogue-editor"
import { useVoices } from "@/hooks/use-voices"

export default function DialoguePage() {
  const { voices, isLoading } = useVoices()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            Multi-Voice Dialogue
          </h1>
          <p className="text-gray-500 mt-2">
            Create conversations with multiple AI voices
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 dark:bg-white/5 dark:border-white/10 p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
              </div>
            ) : (
              <DialogueEditor voices={voices} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}