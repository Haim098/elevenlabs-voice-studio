export const MODELS = [
  {
    id: "eleven_v3",
    name: "AI Voice Studio v3",
    description: "Latest, most expressive model",
  },
  {
    id: "eleven_multilingual_v2",
    name: "Multilingual v2",
    description: "Best quality, 29 languages",
  },
  {
    id: "eleven_flash_v2_5",
    name: "Flash v2.5",
    description: "Ultra-fast, great quality",
  },
  {
    id: "eleven_flash_v2",
    name: "Flash v2",
    description: "Ultra-fast, multilingual",
  },
  {
    id: "eleven_turbo_v2_5",
    name: "Turbo v2.5",
    description: "Low latency, good quality",
  },
  {
    id: "eleven_turbo_v2",
    name: "Turbo v2",
    description: "Low latency",
  },
  {
    id: "eleven_monolingual_v1",
    name: "English v1",
    description: "English only, classic",
  },
] as const;

export const VOICE_DESIGN_MODELS = [
  {
    id: "eleven_ttv_v3",
    name: "Voice Design v3",
    description: "Latest & most expressive",
  },
  {
    id: "eleven_multilingual_ttv_v2",
    name: "Voice Design v2",
    description: "Multilingual voice design",
  },
] as const;

export const OUTPUT_FORMATS = [
  {
    id: "mp3_44100_128",
    name: "MP3 44.1kHz 128kbps",
    description: "Best quality",
  },
  {
    id: "mp3_22050_32",
    name: "MP3 22kHz 32kbps",
    description: "Smaller file",
  },
  {
    id: "pcm_16000",
    name: "PCM 16kHz",
    description: "Raw audio",
  },
  {
    id: "pcm_44100",
    name: "PCM 44.1kHz",
    description: "Raw high quality",
  },
] as const;

export const DEFAULT_VOICE_SETTINGS = {
  stability: 0.5,
  similarityBoost: 0.75,
  style: 0,
  speed: 1,
  useSpeakerBoost: true,
} as const;

export const MAX_TEXT_LENGTH = 5000;
export const MAX_CLONE_FILES = 25;
export const MAX_CLONE_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const HISTORY_MAX_ITEMS = 50;

export const ACCEPTED_AUDIO_TYPES = {
  "audio/*": [".mp3", ".wav", ".m4a", ".ogg", ".flac", ".webm"],
};
