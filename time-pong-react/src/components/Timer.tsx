import React, { useState, useEffect, useRef, useCallback } from 'react';
import timerSound from '@/assets/sounds/times-up-tone.mp3';

interface TimerProps {
  onTimerFinish?: (duration: number) => void;
  minMilliseconds?: number;
  maxMilliseconds?: number;
}

export const Timer: React.FC<TimerProps> = ({
  onTimerFinish,
  minMilliseconds = 2000,
  maxMilliseconds = 40000,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio(timerSound);
    audioRef.current.volume = 1;

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.volume = 1;
      audioRef.current.play();
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsRunning(false);
    playSound();
    if (onTimerFinish) {
      onTimerFinish(timer);
    }
  }, [timer, onTimerFinish, playSound]);

  const timerPress = useCallback(() => {
    if (isRunning) {
      // Stop the timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsRunning(false);
    } else {
      // Ensure audio is preloaded
      if (audioRef.current && !audioRef.current.preload) {
        audioRef.current.volume = 0;
        audioRef.current.play();
        audioRef.current.preload = 'auto';
      }

      // Get random duration
      const millisecondsToAdd =
        Math.random() * (maxMilliseconds - minMilliseconds) + minMilliseconds;

      setTimer(millisecondsToAdd);
      setIsRunning(true);

      // Set timeout
      timeoutRef.current = setTimeout(() => {
        stopTimer();
      }, millisecondsToAdd);
    }
  }, [isRunning, minMilliseconds, maxMilliseconds, stopTimer]);

  const toFixed = (val: number): string => {
    return (val / 1000).toFixed(2);
  };

  return (
    <button
      onClick={timerPress}
      className={`relative mx-auto my-8 block h-36 w-36 cursor-pointer rounded-full border-[15px] bg-white transition-colors active:bg-opacity-90 ${
        isRunning
          ? 'border-[var(--special-highlight)] text-[var(--special-highlight)]'
          : 'border-[var(--limited-highlight)] text-[var(--limited-highlight)]'
      }`}
    >
      {/* Play arrow icon when not running */}
      {!isRunning && (
        <svg
          className="absolute left-[25%] top-[25%] h-[50%] w-[50%]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      )}

      {/* Clock hands when running */}
      {isRunning && (
        <>
          {/* Slow hand */}
          <svg
            className="absolute left-[10%] top-[25%] h-[50%] w-[40%] origin-right animate-[spin_20s_linear_infinite]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 13H5v-2h14v2z" />
          </svg>
          {/* Fast hand */}
          <svg
            className="absolute left-[10%] top-[25%] h-[50%] w-[40%] origin-right animate-[spin_2s_linear_infinite]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 13H5v-2h14v2z" />
          </svg>
        </>
      )}

      {/* Timer text */}
      <p
        className={`relative top-[85px] text-2xl text-[#ccc] transition-opacity duration-500 ${
          isRunning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {toFixed(timer)}
      </p>
    </button>
  );
};
