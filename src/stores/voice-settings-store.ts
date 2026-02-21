"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_VOICE_SETTINGS } from "@/lib/constants";

interface VoiceSettingsState {
  stability: number;
  similarityBoost: number;
  style: number;
  speed: number;
  useSpeakerBoost: boolean;
  modelId: string;
  outputFormat: string;

  setStability: (v: number) => void;
  setSimilarityBoost: (v: number) => void;
  setStyle: (v: number) => void;
  setSpeed: (v: number) => void;
  setUseSpeakerBoost: (v: boolean) => void;
  setModelId: (id: string) => void;
  setOutputFormat: (f: string) => void;
  resetToDefaults: () => void;
}

export const useVoiceSettingsStore = create<VoiceSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_VOICE_SETTINGS,
      modelId: "eleven_multilingual_v2",
      outputFormat: "mp3_44100_128",

      setStability: (v) => set({ stability: v }),
      setSimilarityBoost: (v) => set({ similarityBoost: v }),
      setStyle: (v) => set({ style: v }),
      setSpeed: (v) => set({ speed: v }),
      setUseSpeakerBoost: (v) => set({ useSpeakerBoost: v }),
      setModelId: (id) => set({ modelId: id }),
      setOutputFormat: (f) => set({ outputFormat: f }),
      resetToDefaults: () =>
        set({
          ...DEFAULT_VOICE_SETTINGS,
          modelId: "eleven_multilingual_v2",
          outputFormat: "mp3_44100_128",
        }),
    }),
    {
      name: "elevenlabs-voice-settings",
    }
  )
);
