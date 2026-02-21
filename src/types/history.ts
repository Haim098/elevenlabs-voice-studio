export interface GenerationHistoryItem {
  id: string;
  type: "tts" | "dialogue" | "voice-design";
  timestamp: number;
  text: string;
  voiceName: string;
  voiceId: string;
  modelId: string;
  audioUrl?: string;
  duration: number;
}
