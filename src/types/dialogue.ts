export interface DialogueLine {
  id: string;
  text: string;
  voiceId: string;
  voiceName?: string;
}

export interface DialogueRequest {
  inputs: Array<{
    text: string;
    voiceId: string;
  }>;
}
