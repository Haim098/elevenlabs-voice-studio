import { NextResponse } from 'next/server';
import { getElevenLabsClient } from '@/lib/elevenlabs';

export async function GET() {
  try {
    const client = getElevenLabsClient();
    const voices = await client.voices.getAll();

    return NextResponse.json(voices);
  } catch (error) {
    console.error('Error fetching voices:', error);

    const message = error instanceof Error ? error.message : 'Failed to fetch voices';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}