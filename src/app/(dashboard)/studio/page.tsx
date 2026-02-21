"use client"

import { motion } from "framer-motion"
import { TtsForm } from "@/components/studio/tts-form"
import { VoiceSettingsPanel } from "@/components/studio/voice-settings-panel"

export default function StudioPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            Text-to-Speech Studio
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate natural-sounding speech from text using AI voices
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-6">
            <TtsForm />
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <VoiceSettingsPanel />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
