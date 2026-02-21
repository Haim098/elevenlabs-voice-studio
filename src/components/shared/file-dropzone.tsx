"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion } from "framer-motion"
import { Upload, FileAudio } from "lucide-react"
import { cn } from "@/lib/utils"
import { ACCEPTED_AUDIO_TYPES, MAX_CLONE_FILE_SIZE } from "@/lib/constants"
import { formatFileSize } from "@/lib/audio-utils"

interface FileDropzoneProps {
  onFilesAdded: (files: File[]) => void
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  className?: string
}

export function FileDropzone({
  onFilesAdded,
  accept = ACCEPTED_AUDIO_TYPES,
  maxFiles = 10,
  maxSize = MAX_CLONE_FILE_SIZE,
  className
}: FileDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles)
  }, [onFilesAdded])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple: maxFiles > 1
  })

  const acceptedFormats = Object.values(accept).flat().join(", ")

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer",
          "bg-white/5 backdrop-blur-xl dark:bg-white/5",
          "hover:border-violet-500/50 hover:bg-violet-500/5",
          isDragActive && !isDragReject && "border-violet-500 bg-violet-500/10",
          isDragReject && "border-red-500 bg-red-500/10",
          !isDragActive && !isDragReject && "border-white/10 dark:border-white/10"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center p-12">
          <motion.div
            animate={{
              scale: isDragActive ? 1.1 : 1,
              rotate: isDragActive ? 5 : 0
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {isDragReject ? (
              <FileAudio className="w-12 h-12 text-red-500 mb-4" />
            ) : (
              <Upload className="w-12 h-12 text-violet-500 mb-4" />
            )}
          </motion.div>

          <p className="text-lg font-medium text-white mb-2">
            {isDragReject
              ? "Invalid file type"
              : isDragActive
              ? "Drop your files here"
              : "Drag & drop audio files here"}
          </p>

          <p className="text-sm text-gray-400 text-center">
            or click to browse
          </p>

          <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
            <p>Accepted formats: {acceptedFormats}</p>
            <p>Max file size: {formatFileSize(maxSize)}</p>
            {maxFiles > 1 && <p>Max {maxFiles} files</p>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}