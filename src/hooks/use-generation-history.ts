"use client";

import { useState, useEffect, useCallback } from 'react';
import type { GenerationHistoryItem } from '@/types/history';

const STORAGE_KEY = 'elevenlabs-generation-history';
const MAX_HISTORY_ITEMS = 50;

export function useGenerationHistory() {
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load generation history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save generation history:', error);
    }
  }, [history]);

  const addToHistory = useCallback((item: GenerationHistoryItem) => {
    setHistory((prev) => {
      const newHistory = [item, ...prev];

      // Prune oldest items if exceeding max limit
      if (newHistory.length > MAX_HISTORY_ITEMS) {
        return newHistory.slice(0, MAX_HISTORY_ITEMS);
      }

      return newHistory;
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}