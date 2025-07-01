import React from 'react';
import styles from './AIFormPage.module.css';

interface FeedbackDisplayProps {
  scores: { [key: string]: number };
  overallFeedback: string;
  observation: string;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ scores, overallFeedback, observation }) => {
  return (
    <div className={styles.component}>
      <h2 className={styles.heading}>Feedback</h2>
      <div>
        {Object.entries(scores).map(([key, score]) => (
          <p key={key} className={styles.paragraph}>{key}: {score}</p>
        ))}
      </div>
      <div>
        <h3 className={styles.heading}>Overall Feedback</h3>
        <p className={styles.paragraph}>{overallFeedback}</p>
      </div>
      <div>
        <h3 className={styles.heading}>Observation</h3>
        <p className={styles.paragraph}>{observation}</p>
      </div>
    </div>
  );
};

export default FeedbackDisplay; 