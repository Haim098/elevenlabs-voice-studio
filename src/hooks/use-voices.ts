"use client";

import { useQuery } from '@tanstack/react-query';
import type { Voice } from '@/types/voice';

interface VoicesResponse {
  voices?: Voice[];
  error?: string;
}

export function useVoices() {
  const { data, isLoading, error, refetch } = useQuery<Voice[], Error>({
    queryKey: ['voices'],
    queryFn: async () => {
      const response = await fetch('/api/voices');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch voices');
      }

      const data: VoicesResponse = await response.json();
      return data.voices || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return {
    voices: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
}