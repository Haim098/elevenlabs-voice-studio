"use client";

import { useCallback } from "react";
import {
  useAudioPlayerStore,
  type AudioTrack,
} from "@/stores/audio-player-store";

export function useAudioPlayer() {
  const store = useAudioPlayerStore();

  const playAudio = useCallback(
    (id: string, url: string, title: string, voiceName: string = "Voice") => {
      const track: AudioTrack = {
        id,
        url,
        title,
        voiceName,
      };
      store.play(track);
    },
    [store]
  );

  return {
    currentTrack: store.currentTrack,
    isPlaying: store.isPlaying,
    volume: store.volume,
    currentTime: store.currentTime,
    duration: store.duration,

    play: store.play,
    pause: store.pause,
    resume: store.resume,
    togglePlay: store.togglePlay,
    setVolume: store.setVolume,
    clear: store.clear,

    playAudio,
  };
}
