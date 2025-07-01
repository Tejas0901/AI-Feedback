"use client";

import React, { useRef } from 'react';
import styles from './AIFormPage.module.css';

interface AudioPlayerProps {
  file: File | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ file }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <div className={styles.component}>
      {file ? (
        <>
          <audio ref={audioRef} src={URL.createObjectURL(file)} controls />
          <div>
          <button onClick={handlePlayPause} className={styles.button}>
            Play/Pause
          </button>
          </div>
        </>
      ) : (
        <p className={styles.paragraph}>No audio file selected</p>
      )}
    </div>
  );
};

export default AudioPlayer; 