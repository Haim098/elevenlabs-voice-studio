export interface TtsRequest {
  voiceId: string;
  text: string;
  modelId: string;
  outputFormat: string;
  stability: number;
  similarityBoost: number;
  style: number;
  speed: number;
  useSpeakerBoost: boolean;
}

export interface TtsStreamParams extends TtsRequest {
  onChunk?: (chunk: Uint8Array) => void;
  onProgress?: (progress: number) => void;
}
