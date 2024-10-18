// src/components/TaskTimer.js
import React, { useState } from 'react';

const TaskTimer = () => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  let timerInterval;

  const startTimer = () => {
    setIsRunning(true);
    timerInterval = setInterval(() => {
      setTimeSpent((prevTime) => prevTime + 1); // Increase time by 1 minute every minute
    }, 60000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval); // Stop the timer
    setIsRunning(false);
  };

  return (
    <div>
      <p>Time spent: {timeSpent} minutes</p>
      <button className="btn btn-primary" onClick={startTimer} disabled={isRunning}>
        Start
      </button>
      <button className="btn btn-secondary" onClick={stopTimer} disabled={!isRunning}>
        Stop
      </button>
    </div>
  );
};

export default TaskTimer;
