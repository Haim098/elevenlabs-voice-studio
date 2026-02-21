"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface VoiceCloneRequest {
  name: string;
  files: File[];
}

interface VoiceCloneResult {
  voiceId?: string;
  name?: string;
  [key: string]: unknown;
}

export function useVoiceClone() {
  const queryClient = useQueryClient();

  const mutation = useMutation<VoiceCloneResult, Error, VoiceCloneRequest>({
    mutationFn: async ({ name, files }) => {
      const formData = new FormData();
      formData.append("name", name);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/voice-clone", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Voice cloning failed");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate voices cache so the new voice appears everywhere
      queryClient.invalidateQueries({ queryKey: ["voices"] });
    },
  });

  return {
    clone: mutation.mutate,
    isCloning: mutation.isPending,
    result: mutation.data || null,
    error: mutation.error?.message || null,
    reset: mutation.reset,
  };
}
