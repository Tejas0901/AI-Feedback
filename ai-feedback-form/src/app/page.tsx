"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import FileUpload from './components/FileUpload';
import AudioPlayer from './components/AudioPlayer';
import FeedbackDisplay from './components/FeedbackDisplay';
import { transcribeAudioWithDeepgram } from './DeepgramAI';

export default function AIFormPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    scores: { [key: string]: number };
    overallFeedback: string;
    observation: string;
  } | null>(null);

  const handleProcess = async () => {
    if (!file) {
      setError('Please upload an audio file first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setFeedback(null);

    try {
      const result = await transcribeAudioWithDeepgram(file);
      setFeedback(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing the audio.';
      setError(errorMessage);
      console.error('Error processing audio:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>AI Audio Feedback System</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
        Upload an audio file to get AI-powered speech analysis and feedback
      </p>
      
      <FileUpload setFile={setFile} isProcessing={isProcessing} />
      <AudioPlayer file={file} />
      
      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <button
        className={styles.processButton}
        onClick={handleProcess}
        disabled={!file || isProcessing}
      >
        {isProcessing ? 'Analyzing Audio...' : 'Analyze Audio'}
      </button>

      {feedback && <FeedbackDisplay {...feedback} />}
    </main>
  );
}
