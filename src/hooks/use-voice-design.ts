"use client";

import { useMutation } from '@tanstack/react-query';
import type { VoiceDesignRequest, VoiceDesignPreview } from '@/types/voice-design';

export function useVoiceDesign() {
  const mutation = useMutation<VoiceDesignPreview[], Error, VoiceDesignRequest>({
    mutationFn: async (request) => {
      const response = await fetch('/api/voice-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Voice design failed');
      }

      const previews = await response.json();
      return previews;
    },
  });

  return {
    design: mutation.mutate,
    isDesigning: mutation.isPending,
    previews: mutation.data || null,
    error: mutation.error?.message || null,
    reset: mutation.reset,
  };
}