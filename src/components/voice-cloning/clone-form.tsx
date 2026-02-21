"use client"

import { useState } from "react"
import { Loader2, Sparkles, Upload, Mic, CheckCircle2, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CloneUploadZone } from "./clone-upload-zone"
import { AudioRecorder } from "./audio-recorder"
import { useVoiceClone } from "@/hooks/use-voice-clone"
import { useVoices } from "@/hooks/use-voices"

interface CloneFormProps {
  className?: string
}

export function CloneForm({ className }: CloneFormProps) {
  const [voiceName, setVoiceName] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [activeTab, setActiveTab] = useState("upload")
  const { clone, isCloning, result, reset } = useVoiceClone()
  const { refetch: refetchVoices } = useVoices()

  const handleRecordingComplete = (file: File) => {
    setFiles((prev) => [...prev, file])
    toast.success("Recording added to samples")
  }

  const handleSubmit = () => {
    if (!voiceName.trim()) {
      toast.error("Please enter a voice name")
      return
    }

    if (files.length === 0) {
      toast.error("Please upload or record at least one audio sample")
      return
    }

    clone(
      { name: voiceName, files },
      {
        onSuccess: (data) => {
          toast.success(`Voice "${voiceName}" cloned successfully!`)
          // Refresh the voices list so the new voice appears everywhere
          refetchVoices()
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create voice clone")
        },
      }
    )
  }

  const handleReset = () => {
    setVoiceName("")
    setFiles([])
    reset()
  }

  // Success state
  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("space-y-6", className)}
      >
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-green-400">
            Voice Cloned Successfully!
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your voice <span className="font-medium text-foreground">"{result.name || voiceName}"</span> has
            been created and is ready to use. It will appear in the voice selector
            across all sections of the app.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              Clone Another Voice
            </Button>
            <Button
              onClick={() => window.location.href = "/studio"}
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white"
            >
              Go to Studio
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Voice Name */}
      <div className="space-y-2">
        <Label htmlFor="voice-name">Voice Name</Label>
        <Input
          id="voice-name"
          value={voiceName}
          onChange={(e) => setVoiceName(e.target.value)}
          placeholder="Enter a name for your cloned voice"
          className={cn(
            "bg-white/5 backdrop-blur-xl border-white/10",
            "dark:bg-white/5 dark:border-white/10",
            "focus:border-violet-500 dark:focus:border-violet-500"
          )}
          disabled={isCloning}
        />
      </div>

      {/* Upload or Record Tabs */}
      <div className="space-y-2">
        <Label>Audio Samples</Label>
        <p className="text-sm text-muted-foreground">
          Upload audio files or record directly. Clear speech with minimal
          background noise works best. More samples = better quality.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger
              value="record"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
            >
              <Mic className="w-4 h-4 mr-2" />
              Record
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <CloneUploadZone files={files} onFilesChange={setFiles} />
          </TabsContent>

          <TabsContent value="record" className="mt-4">
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Show file count summary */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg bg-violet-500/10 border border-violet-500/20 px-4 py-3"
          >
            <p className="text-sm text-violet-300">
              {files.length} audio sample{files.length > 1 ? "s" : ""} ready
              {files.length < 3 && (
                <span className="text-muted-foreground">
                  {" "}
                  — adding more samples improves clone quality
                </span>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isCloning || !voiceName.trim() || files.length === 0}
        className={cn(
          "w-full bg-gradient-to-r from-violet-600 to-blue-600",
          "hover:from-violet-700 hover:to-blue-700",
          "text-white font-medium h-12",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isCloning && "animate-pulse"
        )}
      >
        {isCloning ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Voice Clone...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Create Voice Clone
          </>
        )}
      </Button>
    </div>
  )
}
