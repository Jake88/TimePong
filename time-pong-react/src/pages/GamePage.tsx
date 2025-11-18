import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Timer } from '@/components/Timer';
import { CardDeck } from '@/components/CardDeck';
import { EffectCard } from '@/components/EffectCard';
import type { CardDeckRef } from '@/components/CardDeck';
import type { EffectCardRef } from '@/components/EffectCard';
import type { Card } from '@/types/card.types';

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
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[10] flex h-14 items-center justify-between bg-[var(--app-header-background-color)] px-4 shadow-md">
        <button
          onClick={handleBack}
          className="flex items-center text-[var(--primary-text-color)] transition-colors hover:text-[var(--secondary-text-color)]"
        >
          <svg
            className="h-6 w-6"
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
          <span className="ml-2">Home</span>
        </button>

        <h2 className="text-lg font-semibold text-[var(--primary-text-color)]">
          TimePong
        </h2>

        <div className="w-16" /> {/* Spacer for centering */}
      </header>

      {/* Main content */}
      <div className="mx-auto box-border max-w-[400px] px-4 pt-14">
        {/* Effects container */}
        <div className="flex flex-row justify-center">
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
        </div>

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
          <div className="my-8 space-y-4 text-center">
            <h3 className="text-2xl font-bold text-[var(--primary-text-color)]">
              Out of Rounds
            </h3>
            <p className="text-[var(--secondary-text-color)]">
              Not ready to finish? The game continues as long as you keep playing!
            </p>
          </div>
        )}

        {/* Card deck */}
        <CardDeck
          ref={cardDeckRef}
          currentCard={currentCard}
          onClose={handleCardClose}
          onCategorySelected={handleCategorySelected}
        />
      </div>

      {/* Instructions */}
      <div className="mx-auto mt-8 max-w-[400px] px-4 pb-8">
        <div className="rounded-lg bg-[var(--secondary-bg)] p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase text-[var(--secondary-text-color)]">
            How to Play
          </h3>
          <ul className="space-y-2 text-sm text-[var(--light-grey)]">
            <li>• Press the timer to start the countdown</li>
            <li>• When the timer rings, draw a card</li>
            <li>• Choose drinking or non-drinking option</li>
            <li>• Follow the card instructions</li>
            <li>• Click the card to close and continue</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
