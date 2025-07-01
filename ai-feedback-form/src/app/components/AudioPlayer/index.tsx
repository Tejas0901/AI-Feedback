"use client";

import React, { useRef, useState } from 'react';
import styles from './styles.module.css';

interface AudioPlayerProps {
  file: File | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ file }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className={styles.audioPlayer}>
      {file ? (
        <>
          <audio 
            ref={audioRef} 
            src={URL.createObjectURL(file)} 
            controls 
            className={styles.audioElement}
            onEnded={handleAudioEnd}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
          <div>
            <button onClick={handlePlayPause} className={styles.button}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </>
      ) : (
        <p className={styles.noFile}>No audio file selected</p>
      )}
    </div>
  );
};

export default AudioPlayer; 