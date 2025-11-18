import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Card, RarityType } from '@/types/card.types';
import cardsData from '@/data/cards.json';
import truthQuestions from '@/data/truth-questions.json';
import { useSettings } from '@/context/SettingsContext';

interface GameFilters {
  isDrinking: boolean;
  isSpellActive: boolean;
  restrictTo?: Partial<Card>;
}

interface GameState {
  currentCard: Card | null;
  currentEffects: Card[];
  roundsRemaining: number;
  isDrinking: boolean;
  playedOneHitWonders: string[];
  usedTruths: string[];
  drawnSetDeckCards: string[]; // Track drawn cards in Set Deck mode
}

interface GameContextType {
  gameState: GameState;
  setIsDrinking: (isDrinking: boolean) => void;
  drawCard: (filters?: Partial<GameFilters>) => Card;
  addEffect: (effect: Card) => void;
  removeEffect: (effect: Card) => void;
  decrementRound: () => void;
  resetGame: () => void;
  getAllCards: () => Card[];
  filterCards: (filters: Partial<Card>) => Card[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();

  const getInitialState = useCallback((): GameState => ({
    currentCard: null,
    currentEffects: [],
    roundsRemaining: settings.gameMode === 'rounds' ? settings.roundsCount : 10,
    isDrinking: settings.defaultDrinkingMode,
    playedOneHitWonders: [],
    usedTruths: [],
    drawnSetDeckCards: [],
  }), [settings.gameMode, settings.roundsCount, settings.defaultDrinkingMode]);

  const [gameState, setGameState] = useState<GameState>(getInitialState());

  const setIsDrinking = useCallback((isDrinking: boolean) => {
    setGameState((prev) => ({ ...prev, isDrinking }));
  }, []);

  const getRandomArrayItem = useCallback(<T,>(array: T[]): T => {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }, []);

  const getTruthQuestion = useCallback((): string => {
    const availableTruths = truthQuestions.filter(
      (truth) => !gameState.usedTruths.includes(truth)
    );

    if (availableTruths.length === 0) {
      // Reset if all truths have been used
      setGameState((prev) => ({ ...prev, usedTruths: [] }));
      return truthQuestions[0];
    }

    const selectedTruth = getRandomArrayItem(availableTruths);
    setGameState((prev) => ({
      ...prev,
      usedTruths: [...prev.usedTruths, selectedTruth],
    }));

    return selectedTruth;
  }, [gameState.usedTruths, getRandomArrayItem]);

  const getValidCards = useCallback(
    (filters: Partial<GameFilters>): Card[] => {
      return (cardsData as Card[]).filter((card) => {
        // Filter out one-hit wonders that have already been played
        if (card.oneHitWonder && card.title && gameState.playedOneHitWonders.includes(card.title)) {
          return false;
        }

        // Filter by enabled decks
        if (card.deck && !settings.enabledDecks[card.deck as keyof typeof settings.enabledDecks]) {
          return false;
        }

        // Filter by rarity if specified
        if (filters.restrictTo?.rarity && card.rarity !== filters.restrictTo.rarity) {
          return false;
        }

        // Filter by drinking preference
        if (filters.isDrinking !== undefined) {
          if (filters.isDrinking && !card.forDrinkers) return false;
          if (!filters.isDrinking && !card.forNonDrinkers) return false;
        }

        // Filter by card type restriction
        if (filters.restrictTo?.type && card.type !== filters.restrictTo.type) {
          return false;
        }

        // Filter out spells if a spell is already active
        if (filters.isSpellActive && card.type === 'spell') {
          return false;
        }

        // Don't draw the same card twice in a row
        if (gameState.currentCard && card.title === gameState.currentCard.title) {
          return false;
        }

        return true;
      });
    },
    [gameState.playedOneHitWonders, gameState.currentCard, settings.enabledDecks]
  );

  const drawCard = useCallback(
    (filters: Partial<GameFilters> = {}): Card => {
      // Handle Set Deck Mode
      if (settings.gameMode === 'setDeck') {
        // Get cards from the selected deck
        const selectedDeckCards = (cardsData as Card[]).filter((card) =>
          card.title && settings.selectedCards.includes(card.title)
        );

        if (selectedDeckCards.length === 0) {
          // If no cards selected, return a fallback card
          const fallbackCard = (cardsData as Card[]).find((card) => card.rarity === 'basic');
          return processCard(fallbackCard || (cardsData as Card[])[0]);
        }

        // Check if all cards have been drawn
        const availableCards = selectedDeckCards.filter(
          (card) => card.title && !gameState.drawnSetDeckCards.includes(card.title)
        );

        if (availableCards.length === 0) {
          // Reshuffle - reset drawn cards and draw from full deck
          setGameState((prev) => ({ ...prev, drawnSetDeckCards: [] }));
          const selectedCard = getRandomArrayItem(selectedDeckCards);

          // Mark as drawn
          if (selectedCard.title) {
            setGameState((prev) => ({
              ...prev,
              drawnSetDeckCards: [selectedCard.title!],
            }));
          }

          return processCard(selectedCard);
        }

        // Draw from available cards
        const selectedCard = getRandomArrayItem(availableCards);

        // Mark as drawn
        if (selectedCard.title) {
          setGameState((prev) => ({
            ...prev,
            drawnSetDeckCards: [...prev.drawnSetDeckCards, selectedCard.title!],
          }));
        }

        return processCard(selectedCard);
      }

      // Merge default filters (for standard modes)
      const mergedFilters: Partial<GameFilters> = {
        isDrinking: gameState.isDrinking,
        isSpellActive: gameState.currentEffects.some((effect) => effect.type === 'spell'),
        restrictTo: filters.restrictTo || gameState.currentCard?.restrict,
        ...filters,
      };

      // Use rarity distribution from settings
      const rarityBounds = settings.rarityDistribution;

      // Determine rarity based on random roll
      const result = Math.random() * 100;
      let targetRarity: RarityType;

      if (
        result < rarityBounds.basic &&
        gameState.currentCard?.rarity !== 'basic' &&
        !mergedFilters.restrictTo?.type
      ) {
        targetRarity = 'basic';
      } else if (result < rarityBounds.regular) {
        targetRarity = 'regular';
      } else if (result < rarityBounds.limited) {
        targetRarity = 'limited';
      } else if (result < rarityBounds.special) {
        targetRarity = 'special';
      } else if (result < rarityBounds.rare) {
        targetRarity = 'rare';
      } else {
        targetRarity = 'basic';
      }

      // Get valid cards with rarity filter
      const validCards = getValidCards({
        ...mergedFilters,
        restrictTo: { ...mergedFilters.restrictTo, rarity: targetRarity },
      });

      if (validCards.length === 0) {
        // Fallback: try without rarity restriction
        const fallbackCards = getValidCards(mergedFilters);
        if (fallbackCards.length === 0) {
          // Ultimate fallback: return first basic card
          const basicCard = (cardsData as Card[]).find((card) => card.rarity === 'basic');
          return basicCard || (cardsData as Card[])[0];
        }
        const selectedCard = getRandomArrayItem(fallbackCards);
        return processCard(selectedCard);
      }

      const selectedCard = getRandomArrayItem(validCards);
      return processCard(selectedCard);
    },
    [gameState, getValidCards, getRandomArrayItem, settings.rarityDistribution, settings.gameMode, settings.selectedCards]
  );

  const processCard = useCallback(
    (card: Card): Card => {
      let processedCard = { ...card };

      // Handle dare cards - inject truth questions
      if (card.type === 'dare' && card.boldRules) {
        processedCard = {
          ...card,
          boldRules: card.boldRules.map((rule) => {
            if (rule.type === 'chicken') {
              return { ...rule, instruction: getTruthQuestion() };
            }
            return rule;
          }),
        };
      }

      // Track one-hit wonders
      if (card.oneHitWonder && card.title) {
        const cardTitle = card.title;
        setGameState((prev) => ({
          ...prev,
          playedOneHitWonders: [...prev.playedOneHitWonders, cardTitle],
        }));
      }

      // Update current card
      setGameState((prev) => ({ ...prev, currentCard: processedCard }));

      return processedCard;
    },
    [getTruthQuestion]
  );

  const addEffect = useCallback((effect: Card) => {
    setGameState((prev) => ({
      ...prev,
      currentEffects: [...prev.currentEffects, effect],
    }));
  }, []);

  const removeEffect = useCallback((effect: Card) => {
    setGameState((prev) => ({
      ...prev,
      currentEffects: prev.currentEffects.filter((e) => e.title !== effect.title),
    }));
  }, []);

  const decrementRound = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      roundsRemaining: Math.max(0, prev.roundsRemaining - 1),
      currentEffects: prev.currentEffects
        .map((effect) => ({
          ...effect,
          duration: effect.duration ? effect.duration - 1 : undefined,
        }))
        // Keep effects with duration = 0 to allow expire animation in EffectCard
        // EffectCard will remove them after animation completes
        .filter((effect) => !effect.duration || effect.duration >= 0),
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(getInitialState());
  }, [getInitialState]);

  const getAllCards = useCallback((): Card[] => {
    return cardsData as Card[];
  }, []);

  const filterCards = useCallback((filters: Partial<Card>): Card[] => {
    return (cardsData as Card[]).filter((card) => {
      return Object.entries(filters).every(([key, value]) => {
        return card[key as keyof Card] === value;
      });
    });
  }, []);

  const value: GameContextType = {
    gameState,
    setIsDrinking,
    drawCard,
    addEffect,
    removeEffect,
    decrementRound,
    resetGame,
    getAllCards,
    filterCards,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
