import { NextRequest, NextResponse } from "next/server";
import { getElevenLabsClient } from "@/lib/elevenlabs";
import { Readable } from "stream";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;

    if (!name) {
      return NextResponse.json(
        { error: "Voice name is required" },
        { status: 400 }
      );
    }

    // Extract all files from FormData
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === "files" && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one audio file is required" },
        { status: 400 }
      );
    }

    // Convert File objects to Node Readable streams for the SDK
    const fileStreams = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);
        // The SDK needs a name property on the stream
        Object.defineProperty(stream, "name", {
          value: file.name || "recording.webm",
          writable: false,
        });
        return stream;
      })
    );

    const client = getElevenLabsClient();

    // Instant Voice Clone using the latest model
    const voice = await client.voices.ivc.create({
      name,
      files: fileStreams,
      description: `Voice clone created from ${files.length} audio sample(s)`,
    });

    return NextResponse.json(voice);
  } catch (error) {
    console.error("Voice cloning error:", error);

    const message =
      error instanceof Error ? error.message : "Voice cloning failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
