"use client"

import { motion } from "framer-motion"
import { CloneForm } from "@/components/voice-cloning/clone-form"
import { Info } from "lucide-react"

export default function VoiceCloningPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full filter blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            Voice Cloning
          </h1>
          <p className="text-muted-foreground mt-2">
            Create a digital clone of any voice using AI technology
          </p>
        </div>

        <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 dark:bg-white/5 dark:border-white/10 p-8">
          {/* How it works */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">How it works</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="text-violet-500 font-medium mr-2">1.</span>
                Upload audio files or record directly from your microphone
              </li>
              <li className="flex items-start">
                <span className="text-violet-500 font-medium mr-2">2.</span>
                Our AI analyzes the unique characteristics of the voice
              </li>
              <li className="flex items-start">
                <span className="text-violet-500 font-medium mr-2">3.</span>
                Your cloned voice is saved permanently and can be used anytime in the Studio
              </li>
            </ul>
          </div>

          {/* Tips */}
          <div className="mb-6 rounded-lg bg-blue-500/10 border border-blue-500/20 p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300/80 space-y-1">
              <p className="font-medium text-blue-300">Tips for best results:</p>
              <ul className="list-disc list-inside space-y-0.5 text-blue-300/70">
                <li>Use clear speech with minimal background noise</li>
                <li>Record at least 30 seconds to 2 minutes of audio</li>
                <li>Multiple samples improve voice quality significantly</li>
                <li>Consistent tone and speaking pace works best</li>
              </ul>
            </div>
          </div>

          <CloneForm />
        </div>
      </div>
    </motion.div>
  )
}
