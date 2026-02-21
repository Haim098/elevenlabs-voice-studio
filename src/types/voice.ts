export interface Voice {
  voiceId: string;
  name: string;
  category?: string;
  description?: string;
  labels?: Record<string, string>;
  previewUrl?: string;
  settings?: VoiceSettings;
}

export interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export interface VoiceListResponse {
  voices: Voice[];
}
