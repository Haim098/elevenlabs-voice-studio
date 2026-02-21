"use client";

import { create } from "zustand";

export interface AudioTrack {
  id: string;
  url: string;
  title: string;
  voiceName: string;
  duration?: number;
}

interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: AudioTrack[];

  play: (track: AudioTrack) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  addToQueue: (track: AudioTrack) => void;
  playNext: () => void;
  clear: () => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  queue: [],

  play: (track) =>
    set({
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      duration: track.duration || 0,
    }),

  pause: () => set({ isPlaying: false }),

  resume: () => set({ isPlaying: true }),

  togglePlay: () => {
    const { isPlaying, currentTrack } = get();
    if (currentTrack) {
      set({ isPlaying: !isPlaying });
    }
  },

  setVolume: (v) => set({ volume: v }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  addToQueue: (track) =>
    set((state) => ({ queue: [...state.queue, track] })),

  playNext: () => {
    const { queue } = get();
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      set({
        currentTrack: next,
        isPlaying: true,
        currentTime: 0,
        queue: rest,
      });
    } else {
      set({ isPlaying: false, currentTime: 0 });
    }
  },

  clear: () =>
    set({
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      queue: [],
    }),
}));
