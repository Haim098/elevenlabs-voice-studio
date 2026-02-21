"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Mic, Square, Pause, Play, Trash2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/lib/audio-utils"
import { motion, AnimatePresence } from "framer-motion"

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void
  className?: string
}

export function AudioRecorder({
  onRecordingComplete,
  className,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)

        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      setAudioUrl(null)
      setAudioBlob(null)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("Failed to start recording:", err)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
      setIsPaused(!isPaused)
    }
  }, [isRecording, isPaused])

  const discardRecording = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setAudioBlob(null)
    setRecordingTime(0)
  }, [audioUrl])

  const confirmRecording = useCallback(() => {
    if (audioBlob) {
      const file = new File(
        [audioBlob],
        `recording-${Date.now()}.webm`,
        { type: "audio/webm" }
      )
      onRecordingComplete(file)
      // Reset
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
      setAudioBlob(null)
      setRecordingTime(0)
    }
  }, [audioBlob, audioUrl, onRecordingComplete])

  // Animated bars for recording visualization
  const bars = Array.from({ length: 24 })

  return (
    <div className={cn("space-y-4", className)}>
      {/* Recording visualization */}
      <div
        className={cn(
          "rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-4 transition-colors",
          isRecording
            ? "border-red-500/50 bg-red-500/5"
            : audioUrl
              ? "border-green-500/50 bg-green-500/5"
              : "border-white/10 bg-white/5"
        )}
      >
        {/* Waveform bars */}
        <div className="flex items-center gap-[2px] h-16">
          {bars.map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "w-1 rounded-full",
                isRecording && !isPaused
                  ? "bg-red-500"
                  : audioUrl
                    ? "bg-green-500"
                    : "bg-white/20"
              )}
              animate={
                isRecording && !isPaused
                  ? {
                      height: [8, 12 + Math.random() * 48, 8],
                    }
                  : { height: audioUrl ? 12 + Math.sin(i * 0.5) * 20 : 8 }
              }
              transition={
                isRecording && !isPaused
                  ? {
                      duration: 0.3 + Math.random() * 0.4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.03,
                    }
                  : { duration: 0.3 }
              }
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-2xl font-mono tabular-nums font-medium">
          {formatDuration(recordingTime)}
        </div>

        {/* Status text */}
        <p className="text-sm text-muted-foreground">
          {isRecording && !isPaused && "Recording..."}
          {isRecording && isPaused && "Paused"}
          {!isRecording && audioUrl && "Recording complete"}
          {!isRecording && !audioUrl && "Click the mic to start recording"}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!isRecording && !audioUrl && (
          <Button
            onClick={startRecording}
            size="lg"
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-full h-14 w-14 p-0"
          >
            <Mic className="w-6 h-6" />
          </Button>
        )}

        {isRecording && (
          <>
            <Button
              onClick={pauseRecording}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 bg-white/5 border-white/10 hover:bg-white/10"
            >
              {isPaused ? (
                <Play className="w-5 h-5" />
              ) : (
                <Pause className="w-5 h-5" />
              )}
            </Button>
            <Button
              onClick={stopRecording}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white rounded-full h-14 w-14 p-0"
            >
              <Square className="w-5 h-5" />
            </Button>
          </>
        )}

        {!isRecording && audioUrl && (
          <>
            <Button
              onClick={discardRecording}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 bg-white/5 border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
            >
              <Trash2 className="w-5 h-5" />
            </Button>

            {/* Playback */}
            <audio src={audioUrl} controls className="h-10 max-w-[200px]" />

            <Button
              onClick={confirmRecording}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full h-14 w-14 p-0"
            >
              <Check className="w-6 h-6" />
            </Button>
          </>
        )}
      </div>

      {!isRecording && !audioUrl && (
        <p className="text-xs text-center text-muted-foreground">
          Record at least 30 seconds of clear speech for best results
        </p>
      )}
    </div>
  )
}
