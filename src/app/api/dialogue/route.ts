import { NextRequest, NextResponse } from 'next/server';
import { getElevenLabsClient } from '@/lib/elevenlabs';
import { dialogueInputSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = dialogueInputSchema.parse(body);

    const { inputs } = validatedData;

    const client = getElevenLabsClient();

    // Call the ElevenLabs dialogue API
    const audioStream = await client.textToDialogue.convert({
      inputs: inputs.map(input => ({
        text: input.text,
        voiceId: input.voiceId,
      })),
    });

    // Collect stream chunks into a buffer
    const chunks: Uint8Array[] = [];

    // Handle different stream types the SDK might return
    if (audioStream && typeof audioStream === 'object') {
      // Check if it's an async iterable
      if (Symbol.asyncIterator in audioStream) {
        for await (const chunk of audioStream as AsyncIterable<Uint8Array>) {
          chunks.push(chunk);
        }
      }
      // Check if it's a ReadableStream
      else if ('getReader' in audioStream) {
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

    // Combine chunks into a single buffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const buffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }

    // Return audio response
    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Dialogue generation error:', error);

    const message = error instanceof Error ? error.message : 'Dialogue generation failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}