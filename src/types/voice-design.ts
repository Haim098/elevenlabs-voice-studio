export interface VoiceDesignRequest {
  voiceDescription: string;
  text: string;
  modelId: string;
  loudness?: number;
  guidanceScale?: number;
}

export interface VoiceDesignPreview {
  generatedVoiceId: string;
  audioBase64: string;
}
