import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  position: relative;
  min-height: 100vh;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  height: 3.5em;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.primaryBackgroundColor};
  padding: 0 1em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${theme.primaryTextColor};
  cursor: pointer;
  padding: 0.5em;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.secondaryTextColor};
  }

  svg {
    height: 1.5em;
    width: 1.5em;
  }

  span {
    margin-left: 0.5em;
  }
`;

const HeaderTitle = styled.h2`
  font-size: 1.125em;
  font-weight: 600;
  color: ${theme.primaryTextColor};
  margin: 0;
`;

const Spacer = styled.div`
  width: 4em;
`;

const MainContent = styled.div`
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 25em;
  padding: 0 1em;
  padding-top: 3.5em;
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

const InstructionsSection = styled.div`
  margin: 2em auto;
  max-width: 25em;
  padding: 0 1em 2em;
`;

const InstructionsBox = styled.div`
  border-radius: 0.5em;
  background-color: ${theme.primaryBackgroundColor};
  padding: 1em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const InstructionsTitle = styled.h3`
  margin: 0 0 0.5em 0;
  font-size: 0.875em;
  font-weight: 600;
  text-transform: uppercase;
  color: ${theme.secondaryTextColor};
`;

const InstructionsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const InstructionItem = styled.li`
  font-size: 0.875em;
  color: ${theme.lightGrey};
  margin: 0 0 0.5em 0;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }

  &:before {
    content: '• ';
    margin-right: 0.5em;
  }
`;

export default function GamePage() {
  const navigate = useNavigate();
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

  // Handle back navigation
  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <BackButton onClick={handleBack}>
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Home</span>
        </BackButton>

        <HeaderTitle>TimePong</HeaderTitle>

        <Spacer />
      </Header>

      {/* Main content */}
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

      {/* Instructions */}
      <InstructionsSection>
        <InstructionsBox>
          <InstructionsTitle>How to Play</InstructionsTitle>
          <InstructionsList>
            <InstructionItem>Press the timer to start the countdown</InstructionItem>
            <InstructionItem>When the timer rings, draw a card</InstructionItem>
            <InstructionItem>Choose drinking or non-drinking option</InstructionItem>
            <InstructionItem>Follow the card instructions</InstructionItem>
            <InstructionItem>Click the card to close and continue</InstructionItem>
          </InstructionsList>
        </InstructionsBox>
      </InstructionsSection>
    </Container>
  );
}
