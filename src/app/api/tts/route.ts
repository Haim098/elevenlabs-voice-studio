import { NextRequest, NextResponse } from "next/server";
import { getElevenLabsClient } from "@/lib/elevenlabs";
import { ttsRequestSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      voiceId,
      text,
      modelId,
      outputFormat,
      stability,
      similarityBoost,
      style,
      speed,
      useSpeakerBoost,
    } = ttsRequestSchema.parse(body);

    const client = getElevenLabsClient();

    const audioStream = await client.textToSpeech.convert(voiceId, {
      text,
      modelId,
      outputFormat: outputFormat as "mp3_44100_128",
      voiceSettings: {
        stability,
        similarityBoost,
        style,
        useSpeakerBoost,
        speed,
      },
    });

    // Collect stream chunks into a buffer
    const chunks: Uint8Array[] = [];

    if (audioStream && typeof audioStream === "object") {
      if (Symbol.asyncIterator in audioStream) {
        for await (const chunk of audioStream as AsyncIterable<Uint8Array>) {
          chunks.push(chunk);
        }
      } else if ("getReader" in audioStream) {
        const reader = (audioStream as ReadableStream).getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) chunks.push(value);
          }
        } finally {
          reader.releaseLock();
        }
      }
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const buffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    const message =
      error instanceof Error ? error.message : "Text-to-speech conversion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
