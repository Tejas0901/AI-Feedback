import { createClient } from '@deepgram/sdk';

const DEEPGRAM_API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

interface FeedbackData {
  scores: { [key: string]: number };
  overallFeedback: string;
  observation: string;
}

export async function transcribeAudioWithDeepgram(file: File): Promise<FeedbackData> {
  try {
    // Convert file to base64 for sending to API
    const arrayBuffer = await file.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    // Call our Next.js API route
    const response = await fetch('/api/analyze-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioData: base64Audio,
        mimeType: file.type,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: FeedbackData = await response.json();
    return result;

  } catch (error) {
    console.error('Error transcribing audio:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to transcribe audio. Please try again.');
  }
}
