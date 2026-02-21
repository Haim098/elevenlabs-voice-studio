"use client";

import { useRef, useEffect, useCallback } from "react";
import { useAudioPlayerStore } from "@/stores/audio-player-store";
import { formatDuration } from "@/lib/audio-utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  X,
  Music2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function AudioPlayerBar() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    pause,
    resume,
    togglePlay,
    setVolume,
    setCurrentTime,
    setDuration,
    playNext,
    clear,
  } = useAudioPlayerStore();

  // Sync audio element with store state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.src !== currentTrack.url) {
      audio.src = currentTrack.url;
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch(() => pause());
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, pause]);

  // Volume sync
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => playNext();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [setCurrentTime, setDuration, playNext]);

  const handleSeek = useCallback(
    (value: number[]) => {
      const audio = audioRef.current;
      if (audio && value[0] !== undefined) {
        audio.currentTime = value[0];
        setCurrentTime(value[0]);
      }
    },
    [setCurrentTime]
  );

  const handleVolumeChange = useCallback(
    (value: number[]) => {
      if (value[0] !== undefined) setVolume(value[0]);
    },
    [setVolume]
  );

  const handleDownload = useCallback(() => {
    if (!currentTrack) return;
    const a = document.createElement("a");
    a.href = currentTrack.url;
    a.download = `${currentTrack.title || "audio"}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [currentTrack]);

  return (
    <>
      <audio ref={audioRef} preload="metadata" />
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 h-20",
              "border-t backdrop-blur-2xl",
              "bg-background/80 dark:bg-black/80",
              "border-white/10"
            )}
          >
            <div className="flex h-full items-center gap-4 px-4 md:px-6">
              {/* Track Info */}
              <div className="flex items-center gap-3 min-w-0 w-48">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600">
                  <Music2 className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {currentTrack.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {currentTrack.voiceName}
                  </p>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex flex-1 flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={playNext}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex w-full max-w-md items-center gap-2">
                  <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
                    {formatDuration(currentTime)}
                  </span>
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="flex-1 cursor-pointer"
                  />
                  <span className="text-xs tabular-nums text-muted-foreground w-10">
                    {formatDuration(duration)}
                  </span>
                </div>
              </div>

              {/* Volume & Actions */}
              <div className="flex items-center gap-2 w-48 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                >
                  {volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-20 cursor-pointer"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={clear}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
