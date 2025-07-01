"use client";

import React, { useState } from 'react';
import styles from './styles.module.css';

interface FileUploadProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ setFile, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && isValidAudioFile(file)) {
      setSelectedFile(file);
      setFile(file);
    } else {
      alert('Please upload a valid audio file (.mp3, .wav, .m4a, .flac, .ogg).');
    }
  };

  const isValidAudioFile = (file: File): boolean => {
    const validTypes = [
      'audio/mpeg', 
      'audio/wav', 
      'audio/mp4', 
      'audio/m4a', 
      'audio/flac', 
      'audio/ogg'
    ];
    return validTypes.includes(file.type);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file && isValidAudioFile(file)) {
      setSelectedFile(file);
      setFile(file);
    } else {
      alert('Please upload a valid audio file (.mp3, .wav, .m4a, .flac, .ogg).');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  return (
    <div 
      className={`${styles.uploadContainer} ${dragActive ? styles.dragActive : ''} ${isProcessing ? styles.processing : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <h2>Upload Audio File</h2>
      <p>Drag and drop an audio file here or click to select</p>
      <p><small>Supported formats: MP3, WAV, M4A, FLAC, OGG</small></p>
      <input
        type="file"
        onChange={handleFileChange}
        accept="audio/mpeg,audio/wav,audio/mp4,audio/m4a,audio/flac,audio/ogg"
        className={styles.fileInput}
        disabled={isProcessing}
      />
      {selectedFile && (
        <p className={styles.fileName}>
          Selected file: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}
      {isProcessing && (
        <div className={styles.processingIndicator}>
          Processing audio...
        </div>
      )}
    </div>
  );
};

export default FileUpload; 