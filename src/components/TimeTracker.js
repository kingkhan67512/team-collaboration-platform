import React, { useState, useEffect } from 'react';

const TimeTracker = ({ taskId }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [startTime, setStartTime] = useState(null); // Track start time

  useEffect(() => {
    let timerInterval;

    if (isTracking) {
      setStartTime(Date.now()); // Capture the start time

      timerInterval = setInterval(() => {
        if (startTime) {
          // Calculate elapsed time using the start time
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000); // Update every second
    }

    return () => clearInterval(timerInterval); // Cleanup on unmount
  }, [isTracking, startTime]);

  const handleStart = () => {
    setIsTracking(true);
  };

  const handleStop = () => {
    setIsTracking(false);
    // Here you can also save the elapsed time back to Firestore if needed
  };

  return (
    <div>
      <h3>Time Tracker</h3>
      <p>{isTracking ? `Elapsed Time: ${elapsedTime}s` : 'Not tracking'}</p>
      <button className="btn btn-primary" onClick={handleStart} disabled={isTracking}>
        Start
      </button>
      <button className="btn btn-danger" onClick={handleStop} disabled={!isTracking}>
        Stop
      </button>
    </div>
  );
};

export default TimeTracker;
