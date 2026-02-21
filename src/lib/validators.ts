import { z } from "zod/v4";

export const ttsRequestSchema = z.object({
  voiceId: z.string().min(1),
  text: z.string().min(1).max(5000),
  modelId: z.string().default("eleven_multilingual_v2"),
  outputFormat: z.string().default("mp3_44100_128"),
  stability: z.number().min(0).max(1).default(0.5),
  similarityBoost: z.number().min(0).max(1).default(0.75),
  style: z.number().min(0).max(1).default(0),
  speed: z.number().min(0.25).max(4).default(1),
  useSpeakerBoost: z.boolean().default(true),
});

export const voiceDesignSchema = z.object({
  voiceDescription: z.string().min(10).max(1000),
  text: z.string().min(100).max(1000),
  modelId: z.string().default("eleven_multilingual_ttv_v2"),
  loudness: z.number().min(-1).max(1).default(0.5),
  guidanceScale: z.number().min(1).max(10).default(5),
});

export const dialogueInputSchema = z.object({
  inputs: z
    .array(
      z.object({
        text: z.string().min(1).max(5000),
        voiceId: z.string().min(1),
      })
    )
    .min(1)
    .max(20),
});

export const voiceCloneSchema = z.object({
  name: z.string().min(1).max(100),
});
