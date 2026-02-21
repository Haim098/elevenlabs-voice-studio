import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

let client: ElevenLabsClient | null = null;

export function getElevenLabsClient(): ElevenLabsClient {
  if (!client) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      throw new Error(
        "ELEVENLABS_API_KEY environment variable is not set. Please add it to .env.local"
      );
    }
    client = new ElevenLabsClient({ apiKey });
  }
  return client;
}
