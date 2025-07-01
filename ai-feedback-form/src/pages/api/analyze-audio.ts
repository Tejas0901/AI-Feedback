import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@deepgram/sdk';

interface FeedbackData {
  scores: { [key: string]: number };
  overallFeedback: string;
  observation: string;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Get the audio data from the request body
    const { audioData, mimeType } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: 'No audio data provided' });
    }

    // Initialize Deepgram client on server side
    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
    
    if (!DEEPGRAM_API_KEY) {
      return res.status(500).json({ error: 'Deepgram API key not configured' });
    }

    const deepgram = createClient(DEEPGRAM_API_KEY);

    // Convert base64 audio data back to buffer
    const audioBuffer = Buffer.from(audioData, 'base64');

    // Transcribe with Deepgram
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        punctuate: true,
        diarize: true,
        paragraphs: true,
        mimetype: mimeType,
      }
    );

    if (error) {
      console.error('Deepgram API error:', error);
      return res.status(500).json({ error: `Transcription failed: ${error.message}` });
    }

    if (!result) {
      return res.status(500).json({ error: 'No transcription result received' });
    }

    // Process the transcription result
    const transcript = result.results?.channels[0]?.alternatives[0]?.transcript || '';
    const confidence = result.results?.channels[0]?.alternatives[0]?.confidence || 0;
    const words = result.results?.channels[0]?.alternatives[0]?.words || [];
    
    // Generate feedback
    const feedback = generateFeedback(transcript, confidence, words);
    
    res.status(200).json(feedback);

  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to process audio'
    });
  }
}

function generateFeedback(transcript: string, confidence: number, words: any[]): FeedbackData {
  const wordCount = words.length;
  const avgWordConfidence = words.reduce((sum, word) => sum + (word.confidence || 0), 0) / wordCount || 0;
  
  // Calculate speech metrics
  const clarityScore = Math.min(confidence * 1.2, 1);
  const fluencyScore = avgWordConfidence;
  const confidenceScore = confidence > 0.7 ? confidence : confidence * 0.8;
  
  // Analyze speech patterns
  const speakingRate = calculateSpeakingRate(words);
  const pauseAnalysis = analyzePauses(words);
  
  return {
    scores: {
      clarity: Math.round(clarityScore * 100) / 100,
      confidence: Math.round(confidenceScore * 100) / 100,
      fluency: Math.round(fluencyScore * 100) / 100,
      pace: Math.round(speakingRate.score * 100) / 100,
      overall: Math.round(((clarityScore + fluencyScore + confidenceScore + speakingRate.score) / 4) * 100) / 100,
    },
    overallFeedback: generateOverallFeedback(confidence, wordCount, transcript, speakingRate, pauseAnalysis),
    observation: `Transcript (${wordCount} words, ${speakingRate.wpm} WPM): "${transcript}"`,
  };
}

function calculateSpeakingRate(words: any[]) {
  if (words.length < 2) return { wpm: 0, score: 0 };
  
  const firstWord = words[0];
  const lastWord = words[words.length - 1];
  const duration = (lastWord.end - firstWord.start) / 60; // Convert to minutes
  const wpm = Math.round(words.length / duration);
  
  // Optimal speaking rate is 150-160 WPM
  let score = 1;
  if (wpm < 120) score = 0.7; // Too slow
  else if (wpm > 180) score = 0.8; // Too fast
  else if (wpm >= 140 && wpm <= 170) score = 1; // Optimal
  else score = 0.9; // Good
  
  return { wpm, score };
}

function analyzePauses(words: any[]) {
  if (words.length < 2) return { averagePause: 0, longPauses: 0 };
  
  const pauses = [];
  for (let i = 1; i < words.length; i++) {
    const pause = words[i].start - words[i - 1].end;
    pauses.push(pause);
  }
  
  const averagePause = pauses.reduce((sum, pause) => sum + pause, 0) / pauses.length;
  const longPauses = pauses.filter(pause => pause > 1).length; // Pauses longer than 1 second
  
  return { averagePause, longPauses };
}

function generateOverallFeedback(
  confidence: number, 
  wordCount: number, 
  transcript: string,
  speakingRate: { wpm: number; score: number },
  pauseAnalysis: { averagePause: number; longPauses: number }
): string {
  const feedback = [];
  
  // Confidence feedback
  if (confidence > 0.9) {
    feedback.push("Excellent speech clarity and articulation.");
  } else if (confidence > 0.7) {
    feedback.push("Good speech quality with clear pronunciation.");
  } else if (confidence > 0.5) {
    feedback.push("Speech could be clearer. Consider speaking more slowly and distinctly.");
  } else {
    feedback.push("Poor audio quality detected. Consider improving recording conditions.");
  }
  
  // Speaking rate feedback
  if (speakingRate.wpm < 120) {
    feedback.push("Speaking pace is quite slow - consider increasing your rate slightly.");
  } else if (speakingRate.wpm > 180) {
    feedback.push("Speaking pace is very fast - consider slowing down for better comprehension.");
  } else if (speakingRate.wpm >= 140 && speakingRate.wpm <= 170) {
    feedback.push("Excellent speaking pace for clear communication.");
  }
  
  // Pause analysis
  if (pauseAnalysis.longPauses > wordCount / 20) {
    feedback.push("Consider reducing long pauses for better flow.");
  }
  
  // Length feedback
  if (wordCount < 10) {
    feedback.push("Very brief speech sample - consider providing a longer recording for better analysis.");
  } else if (wordCount > 100) {
    feedback.push("Good length speech sample for comprehensive analysis.");
  }
  
  if (transcript.length === 0) {
    feedback.push("No speech detected in the audio file.");
  }
  
  return feedback.join(" ");
} 