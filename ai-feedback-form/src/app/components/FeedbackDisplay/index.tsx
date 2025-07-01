import React from 'react';
import styles from './styles.module.css';

interface FeedbackDisplayProps {
  scores: { [key: string]: number };
  overallFeedback: string;
  observation: string;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ scores, overallFeedback, observation }) => {
  const formatScore = (score: number): string => {
    return `${Math.round(score * 100)}%`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return '#10b981'; // Green
    if (score >= 0.6) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className={styles.feedbackContainer}>
      <h2 className={styles.sectionTitle}>Speech Analysis Results</h2>
      
      <div className={styles.scoresSection}>
        <h3 className={styles.subsectionTitle}>Performance Scores</h3>
        {Object.entries(scores).map(([key, score]) => (
          <div key={key} className={styles.scoreItem}>
            <span className={styles.scoreLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </span>
            <span 
              className={styles.scoreValue}
              style={{ color: getScoreColor(score) }}
            >
              {formatScore(score)}
            </span>
          </div>
        ))}
      </div>
      
      <div className={styles.feedbackSection}>
        <h3 className={styles.subsectionTitle}>Overall Feedback</h3>
        <p className={styles.feedbackText}>{overallFeedback}</p>
      </div>
      
      <div className={styles.feedbackSection}>
        <h3 className={styles.subsectionTitle}>Transcript & Analysis</h3>
        <p className={styles.feedbackText}>{observation}</p>
      </div>
    </div>
  );
};

export default FeedbackDisplay; 