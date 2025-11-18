import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGame } from '@/context/GameContext';
import { Timer } from '@/components/Timer';
import { CardDeck } from '@/components/CardDeck';
import { EffectCard } from '@/components/EffectCard';
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
  margin: 2em 0;
  text-align: center;
`;

const GameOverTitle = styled.h3`
  font-size: 1.5em;
  font-weight: bold;
  color: ${theme.primaryTextColor};
  margin: 0 0 1em 0;
`;

const GameOverText = styled.p`
  color: ${theme.secondaryTextColor};
  margin: 0;
  line-height: 1.5;
`;

export default function GamePage() {
  const { gameState, drawCard, setIsDrinking, decrementRound } = useGame();
  const cardDeckRef = useRef<CardDeckRef>(null);
  const spellEffectRef = useRef<EffectCardRef>(null);
  const curseEffectRef = useRef<EffectCardRef>(null);

  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [spellEffect, setSpellEffect] = useState<Card | null>(null);
  const [curseEffect, setCurseEffect] = useState<Card | null>(null);

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
    // Decrement round and update effect durations
    spellEffectRef.current?.roundEnd();
    curseEffectRef.current?.roundEnd();
    decrementRound();

    // Clear current card
    setCurrentCard(null);
  };

  return (
    <Container>
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
        {gameState.roundsRemaining > 0 && (
          <Timer
            onTimerFinish={handleTimerFinish}
            minMilliseconds={2000}
            maxMilliseconds={40000}
          />
        )}

        {/* Game over message */}
        {gameState.roundsRemaining === 0 && (
          <GameOverSection>
            <GameOverTitle>Out of Rounds</GameOverTitle>
            <GameOverText>
              Not ready to finish? The game continues as long as you keep playing!
            </GameOverText>
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
