"use client"

import { motion } from "framer-motion"
import { DesignForm } from "@/components/voice-design/design-form"

export default function VoiceDesignPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            Voice Design
          </h1>
          <p className="text-gray-500 mt-2">
            Create unique AI voices from text descriptions
          </p>
        </div>

        <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 dark:bg-white/5 dark:border-white/10 p-8">
          <DesignForm />
        </div>
      </div>
    </motion.div>
  )
}