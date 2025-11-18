import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import timerSound from '@/assets/sounds/times-up-tone.mp3';
import { theme } from '@/theme';

interface TimerProps {
  onTimerFinish?: (duration: number) => void;
  minMilliseconds?: number;
  maxMilliseconds?: number;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const TimerButton = styled.button<{ $isRunning: boolean }>`
  height: 9em;
  width: 9em;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  margin: 2em auto;
  background-color: #fff;
  border: 15px solid ${props => props.$isRunning ? theme.specialHighlight : theme.limitedHighlight};
  color: ${props => props.$isRunning ? theme.specialHighlight : theme.limitedHighlight};
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  display: block;
  transition: border-color 0.2s ease, color 0.2s ease;

  &:active {
    background-color: ${props => props.$isRunning ? theme.specialSoft : theme.limitedSoft};
  }
`;

const PlayIcon = styled.svg`
  height: 50%;
  width: 50%;
  position: absolute;
  top: 25%;
  left: 25%;
`;

const ClockHand = styled.svg<{ $speed: 'fast' | 'slow' }>`
  transform-origin: right;
  height: 50%;
  width: 40%;
  left: 10%;
  top: 25%;
  position: absolute;
  animation: ${spin} ${props => props.$speed === 'fast' ? '2s' : '20s'} infinite linear;
`;

const TimerText = styled.p<{ $isRunning: boolean }>`
  position: relative;
  top: 85px;
  color: #ccc;
  font-size: 1.5rem;
  margin: 0;
  opacity: ${props => props.$isRunning ? '0' : '1'};
  transition: ${props => props.$isRunning ? 'all 0s ease-out' : 'opacity 0.5s ease-in'};
`;

export const Timer: React.FC<TimerProps> = ({
  onTimerFinish,
  minMilliseconds = 2000,
  maxMilliseconds = 40000,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    <TimerButton onClick={timerPress} $isRunning={isRunning}>
      {/* Play arrow icon when not running */}
      {!isRunning && (
        <PlayIcon viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </PlayIcon>
      )}

      {/* Clock hands when running */}
      {isRunning && (
        <>
          {/* Slow hand */}
          <ClockHand $speed="slow" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H5v-2h14v2z" />
          </ClockHand>
          {/* Fast hand */}
          <ClockHand $speed="fast" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H5v-2h14v2z" />
          </ClockHand>
        </>
      )}

      {/* Timer text */}
      <TimerText $isRunning={isRunning}>
        {toFixed(timer)}
      </TimerText>
    </TimerButton>
  );
};
