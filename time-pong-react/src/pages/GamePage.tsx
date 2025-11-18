import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGame } from '@/context/GameContext';
import { useSettings } from '@/context/SettingsContext';
import { Timer } from '@/components/Timer';
import { CardDeck } from '@/components/CardDeck';
import { EffectCard } from '@/components/EffectCard';
import HelpPopup from '@/components/HelpPopup';
import type { CardDeckRef } from '@/components/CardDeck';
import type { EffectCardRef } from '@/components/EffectCard';
import type { Card } from '@/types/card.types';
import { theme } from '@/theme';

const Container = styled.div`
  height: 100%;
  position: relative;
`;

const MainContent = styled.div`
  height: 100%;
  box-sizing: border-box;
  padding-top: 56px;
  width: 100%;
  margin: auto;
  margin-top: -56px;
  max-width: 400px;
  position: relative;
`;

const EffectsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const GameOverSection = styled.div`
  margin: 2em 1em;
  text-align: center;
  background: linear-gradient(135deg, ${theme.limitedHighlight}22, ${theme.specialHighlight}22);
  border: 2px solid ${theme.limitedHighlight};
  border-radius: 12px;
  padding: 2em;
`;

const GameOverTitle = styled.h3`
  font-size: 2em;
  font-weight: bold;
  color: ${theme.primaryTextColor};
  margin: 0 0 0.5em 0;
`;

const GameOverText = styled.p`
  color: ${theme.secondaryTextColor};
  margin: 0 0 1.5em 0;
  line-height: 1.5;
  font-size: 1.1em;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1em;
  justify-content: center;
  flex-wrap: wrap;
`;

const GameButton = styled.button`
  padding: 0.8em 1.5em;
  background-color: ${theme.limitedHighlight};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.specialHighlight};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(GameButton)`
  background-color: rgba(255, 255, 255, 0.1);

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export default function GamePage() {
  const { gameState, drawCard, setIsDrinking, decrementRound, addEffect, removeEffect, resetGame } = useGame();
  const { settings } = useSettings();
  const cardDeckRef = useRef<CardDeckRef>(null);
  const spellEffectRef = useRef<EffectCardRef>(null);
  const curseEffectRef = useRef<EffectCardRef>(null);

  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [spellEffect, setSpellEffect] = useState<Card | null>(null);
  const [curseEffect, setCurseEffect] = useState<Card | null>(null);
  const [continueEndlessMode, setContinueEndlessMode] = useState(false);

  // Update effect cards when game state changes
  useEffect(() => {
    const spell = gameState.currentEffects.find((effect) => effect.type === 'spell');
    const curse = gameState.currentEffects.find((effect) => effect.type === 'curse');

    setSpellEffect(spell || null);
    setCurseEffect(curse || null);
  }, [gameState.currentEffects]);

  // Handle timer finish - draw a card
  const handleTimerFinish = () => {
    cardDeckRef.current?.drawCard();
  };

  // Handle category selection (drinking/non-drinking)
  const handleCategorySelected = (category: 'drinking' | 'nonDrinking') => {
    const isDrinking = category === 'drinking';
    setIsDrinking(isDrinking);

    // Draw a card with the selected filters
    const filters = {
      isDrinking,
      isSpellActive: !!spellEffect,
      restrictTo: spellEffect?.restrict,
    };

    const drawnCard = drawCard(filters);
    setCurrentCard(drawnCard);
  };

  // Handle card close - trigger round end
  const handleCardClose = () => {
    // First, decrement durations on active effects (for visual feedback in EffectCard)
    spellEffectRef.current?.roundEnd();
    curseEffectRef.current?.roundEnd();

    // Decrement round counter and update effect durations in GameContext
    // This decrements existing effects and removes expired ones
    decrementRound();

    // After decrementing, add the current card to effects if it's a curse or spell
    // This ensures the new effect starts with its original duration
    if (currentCard) {
      if (currentCard.type === 'curse') {
        // Remove any existing curse first (only one curse at a time)
        const existingCurse = gameState.currentEffects.find(effect => effect.type === 'curse');
        if (existingCurse) {
          removeEffect(existingCurse);
        }
        // Add the new curse with its original duration
        addEffect({ ...currentCard });
      } else if (currentCard.type === 'spell') {
        // Add the spell with its original duration
        // (filtering in drawCard prevents multiple spells from being drawn)
        addEffect({ ...currentCard });
      }
    }

    // Clear current card
    setCurrentCard(null);
  };

  return (
    <Container>
      <HelpPopup />
      <MainContent>
        {/* Effects container */}
        <EffectsContainer>
          <EffectCard
            ref={spellEffectRef}
            data={spellEffect}
            label="spell"
            index={0}
          />
          <EffectCard
            ref={curseEffectRef}
            data={curseEffect}
            label="curse"
            index={1}
          />
        </EffectsContainer>

        {/* Timer */}
        {(settings.gameMode === 'endless' || settings.gameMode === 'setDeck' || gameState.roundsRemaining > 0 || continueEndlessMode) && (
          <Timer
            onTimerFinish={handleTimerFinish}
            minMilliseconds={settings.timerMin}
            maxMilliseconds={settings.timerMax}
            audioEnabled={settings.audioEnabled}
            audioVolume={settings.audioVolume}
          />
        )}

        {/* Game over message */}
        {gameState.roundsRemaining === 0 && settings.gameMode === 'rounds' && !continueEndlessMode && (
          <GameOverSection>
            <GameOverTitle>🎉 Game Complete!</GameOverTitle>
            <GameOverText>
              You've finished {settings.roundsCount} rounds! What would you like to do?
            </GameOverText>
            <ButtonGroup>
              <GameButton onClick={() => resetGame()}>
                🔄 Start New Game
              </GameButton>
              <SecondaryButton onClick={() => setContinueEndlessMode(true)}>
                ♾️ Continue Playing
              </SecondaryButton>
            </ButtonGroup>
          </GameOverSection>
        )}

        {/* Card deck */}
        <CardDeck
          ref={cardDeckRef}
          currentCard={currentCard}
          onClose={handleCardClose}
          onCategorySelected={handleCategorySelected}
        />
      </MainContent>
    </Container>
  );
}
