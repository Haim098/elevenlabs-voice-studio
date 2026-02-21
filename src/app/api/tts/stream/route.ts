import { NextRequest } from "next/server";
import { getElevenLabsClient } from "@/lib/elevenlabs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      voiceId,
      text,
      modelId,
      outputFormat = "mp3_44100_128",
      stability = 0.5,
      similarityBoost = 0.75,
      style = 0,
      useSpeakerBoost = true,
    } = body;

    const client = getElevenLabsClient();

    const audioStream = await client.textToSpeech.stream(voiceId, {
      text,
      modelId,
      outputFormat: outputFormat as "mp3_44100_128",
      voiceSettings: {
        stability,
        similarityBoost,
        style,
        useSpeakerBoost,
      },
    });

    // Convert to web-compatible ReadableStream
    let webStream: ReadableStream;

    if (audioStream && typeof audioStream === "object") {
      if ("getReader" in audioStream) {
        webStream = audioStream as ReadableStream;
      } else if (Symbol.asyncIterator in audioStream) {
        webStream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of audioStream as AsyncIterable<Uint8Array>) {
                controller.enqueue(chunk);
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        });
      } else {
        throw new Error("Invalid stream response from ElevenLabs SDK");
      }
    } else {
      throw new Error("Invalid stream response from ElevenLabs SDK");
    }

    return new Response(webStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("TTS streaming error:", error);
    const message =
      error instanceof Error ? error.message : "Text-to-speech streaming failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
