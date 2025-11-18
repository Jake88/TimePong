import { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useSettings } from '@/context/SettingsContext';
import timerSound from '@/assets/sounds/times-up-tone.mp3';
import { theme } from '@/theme';

const Container = styled.div`
  height: calc(100vh - 3.5em);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em;
`;

const Title = styled.h2`
  color: ${theme.primaryTextColor};
  font-size: 2em;
  margin: 0 0 0.5em 0;
  text-align: center;
`;

const Instructions = styled.p`
  color: ${theme.secondaryTextColor};
  text-align: center;
  margin: 0 0 2em 0;
  max-width: 400px;
  line-height: 1.6;
`;

const TimerButton = styled.button<{ $isRunning: boolean; $hasExploded: boolean }>`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  border: none;
  font-size: 3em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props =>
    props.$hasExploded
      ? 'linear-gradient(135deg, #d32f2f, #f44336)'
      : props.$isRunning
      ? `linear-gradient(135deg, ${theme.specialHighlight}, ${theme.limitedHighlight})`
      : `linear-gradient(135deg, ${theme.limitedHighlight}, ${theme.specialHighlight})`
  };
  color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  ${props => props.$hasExploded && `
    animation: explode 0.5s ease;
  `}

  @keyframes explode {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const TimerText = styled.div`
  position: relative;
  z-index: 1;
`;

const Stats = styled.div`
  margin-top: 2em;
  text-align: center;
`;

const StatItem = styled.p`
  color: ${theme.secondaryTextColor};
  margin: 0.5em 0;
  font-size: 1.1em;
`;

const LoserMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #d32f2f, #f44336);
  color: white;
  padding: 2em 3em;
  border-radius: 16px;
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
  z-index: 1000;
  animation: popIn 0.3s ease;

  @keyframes popIn {
    0% {
      transform: translate(-50%, -50%) scale(0);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const ResetButton = styled.button`
  margin-top: 1em;
  padding: 0.8em 2em;
  background-color: white;
  color: #d32f2f;
  border: none;
  border-radius: 8px;
  font-size: 0.6em;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export default function NoBallModePage() {
  const { settings } = useSettings();
  const [isRunning, setIsRunning] = useState(false);
  const [hasExploded, setHasExploded] = useState(false);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio(timerSound);
    audioRef.current.volume = settings.audioVolume;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [settings.audioVolume]);

  const playSound = useCallback(() => {
    if (audioRef.current && settings.audioEnabled) {
      audioRef.current.volume = settings.audioVolume;
      audioRef.current.play();
    }
  }, [settings.audioEnabled, settings.audioVolume]);

  const explode = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsRunning(false);
    setHasExploded(true);
    setRoundsPlayed(prev => prev + 1);
    playSound();
  }, [playSound]);

  const handlePress = useCallback(() => {
    if (hasExploded) {
      // Reset after explosion
      setHasExploded(false);
      setPassCount(0);
      return;
    }

    if (isRunning) {
      // Pass the device (successful pass)
      setPassCount(prev => prev + 1);
    } else {
      // Start the timer
      const duration = Math.random() * (settings.timerMax - settings.timerMin) + settings.timerMin;

      setIsRunning(true);
      setPassCount(0);

      timeoutRef.current = setTimeout(() => {
        explode();
      }, duration);
    }
  }, [isRunning, hasExploded, settings.timerMin, settings.timerMax, explode]);

  const reset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsRunning(false);
    setHasExploded(false);
    setPassCount(0);
    setRoundsPlayed(0);
  };

  return (
    <Container>
      <Title>⚡ No-Ball Mode</Title>
      <Instructions>
        Tap to start the timer, then pass the device quickly! Don't be holding it when time runs out!
      </Instructions>

      <TimerButton
        onClick={handlePress}
        $isRunning={isRunning}
        $hasExploded={hasExploded}
      >
        <TimerText>
          {hasExploded ? '💥' : isRunning ? '🔥' : '▶️'}
        </TimerText>
      </TimerButton>

      {isRunning && (
        <Stats>
          <StatItem>Passes this round: {passCount}</StatItem>
        </Stats>
      )}

      {!isRunning && !hasExploded && roundsPlayed > 0 && (
        <Stats>
          <StatItem>Rounds played: {roundsPlayed}</StatItem>
        </Stats>
      )}

      {hasExploded && (
        <LoserMessage>
          <div>💥 BOOM! 💥</div>
          <div style={{ fontSize: '0.5em', marginTop: '0.5em' }}>
            You got caught!
          </div>
          <div style={{ fontSize: '0.4em', marginTop: '0.3em' }}>
            {passCount} passes this round
          </div>
          <ResetButton onClick={handlePress}>
            Tap to Continue
          </ResetButton>
          <ResetButton onClick={reset} style={{ marginLeft: '1em' }}>
            Reset Game
          </ResetButton>
        </LoserMessage>
      )}
    </Container>
  );
}
