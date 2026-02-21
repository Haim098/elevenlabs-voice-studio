"use client";

import { useState, useRef, useCallback } from 'react';
import type { TtsRequest } from '@/types/tts';

export function useTtsStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (request: TtsRequest) => {
    try {
      // Clean up previous state
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      setError(null);
      setIsStreaming(true);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/tts/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'TTS streaming failed');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // Read the stream
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          if (value) {
            chunks.push(value);
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Combine chunks into a single blob
      const blob = new Blob(chunks as BlobPart[], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Stream cancelled');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [audioUrl]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const reset = useCallback(() => {
    cancel();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setError(null);
    setIsStreaming(false);
  }, [audioUrl, cancel]);

  return {
    generate,
    isStreaming,
    audioUrl,
    error,
    cancel,
    reset,
  };
}