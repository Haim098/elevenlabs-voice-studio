"use client"

import { useCallback, useRef } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileDropzone } from "@/components/shared/file-dropzone"
import { AudioSampleCard } from "./audio-sample-card"
import { ACCEPTED_AUDIO_TYPES, MAX_CLONE_FILE_SIZE } from "@/lib/constants"

interface CloneUploadZoneProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  className?: string
}

export function CloneUploadZone({
  files,
  onFilesChange,
  className,
}: CloneUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFilesAdded = (newFiles: File[]) => {
    onFilesChange([...files, ...newFiles])
  }

  const handleRemoveFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  const handleAddMoreClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || [])
      if (newFiles.length > 0) {
        onFilesChange([...files, ...newFiles])
      }
      // Reset input so the same file can be selected again
      e.target.value = ""
    },
    [files, onFilesChange]
  )

  if (files.length === 0) {
    return (
      <div className={className}>
        <FileDropzone
          onFilesAdded={handleFilesAdded}
          accept={ACCEPTED_AUDIO_TYPES}
          maxFiles={25}
          maxSize={MAX_CLONE_FILE_SIZE}
        />
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-2">
        {files.map((file, index) => (
          <AudioSampleCard
            key={`${file.name}-${index}`}
            file={file}
            onRemove={() => handleRemoveFile(index)}
          />
        ))}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,.m4a,.ogg,.flac,.webm"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Compact "Add more" button instead of a full dropzone */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddMoreClick}
        className="w-full h-10 bg-white/5 border-white/10 border-dashed hover:bg-white/10 hover:border-violet-500/50"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add More Audio Files
      </Button>
    </div>
  )
}
