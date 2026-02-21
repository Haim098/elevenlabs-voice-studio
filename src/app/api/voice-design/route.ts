import { NextResponse } from "next/server";
import { getElevenLabsClient } from "@/lib/elevenlabs";
import { voiceDesignSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = voiceDesignSchema.parse(body);

    const client = getElevenLabsClient();

    const result = await client.textToVoice.design({
      voiceDescription: parsed.voiceDescription,
      text: parsed.text,
      modelId: parsed.modelId as "eleven_multilingual_ttv_v2" | "eleven_ttv_v3",
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Voice design error:", error);
    const message =
      error instanceof Error ? error.message : "Voice design failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
