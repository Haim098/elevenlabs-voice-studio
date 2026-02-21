"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
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
  className
}: CloneUploadZoneProps) {
  const handleFilesAdded = (newFiles: File[]) => {
    onFilesChange([...files, ...newFiles])
  }

  const handleRemoveFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className={cn("space-y-4", className)}>
      {files.length === 0 ? (
        <FileDropzone
          onFilesAdded={handleFilesAdded}
          accept={ACCEPTED_AUDIO_TYPES}
          maxFiles={25}
          maxSize={MAX_CLONE_FILE_SIZE}
        />
      ) : (
        <>
          <div className="space-y-2">
            {files.map((file, index) => (
              <AudioSampleCard
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => handleRemoveFile(index)}
              />
            ))}
          </div>

          <FileDropzone
            onFilesAdded={handleFilesAdded}
            accept={ACCEPTED_AUDIO_TYPES}
            maxFiles={25 - files.length}
            maxSize={MAX_CLONE_FILE_SIZE}
            className="h-32"
          />
        </>
      )}
    </div>
  )
}