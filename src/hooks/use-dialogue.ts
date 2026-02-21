"use client";

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface DialogueInput {
  text: string;
  voiceId: string;
}

interface DialogueRequest {
  inputs: DialogueInput[];
}

export function useDialogue() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (request: DialogueRequest) => {
      const response = await fetch('/api/dialogue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Dialogue generation failed');
      }

      const blob = await response.blob();
      return blob;
    },
    onSuccess: (blob) => {
      // Clean up previous URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      // Create new Object URL
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    },
  });

  const reset = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    mutation.reset();
  };

  return {
    generate: mutation.mutate,
    isGenerating: mutation.isPending,
    audioUrl,
    error: mutation.error?.message || null,
    reset,
  };
}