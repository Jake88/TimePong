import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import styled from 'styled-components';
import type { Card } from '@/types/card.types';
import { CardFace } from './CardFace';
import { CardBack } from './CardBack';
import { theme } from '@/theme';

export interface CardDeckRef {
  drawCard: () => void;
  closeCard: () => void;
}

interface CardDeckProps {
  currentCard: Card | null;
  onClose?: () => void;
  onCategorySelected?: (category: 'drinking' | 'nonDrinking') => void;
}

const DarkOverlay = styled.div<{ $isOpen: boolean }>`
  fixed: left-[-2000px] top-[-2000px];
  position: fixed;
  left: -2000px;
  top: -2000px;
  height: 5000px;
  width: 5000px;
  background-color: #333;
  transition: opacity 0.3s ease;
  opacity: ${props => props.$isOpen ? '0.5' : '0'};
  z-index: ${props => props.$isOpen ? '4' : '-1'};
`;

const FlipContainer = styled.div<{ $isVisible: boolean; $isOpen: boolean }>`
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 4;
  height: 28.75em;
  width: 18.75em;
  perspective: 1000px;
  display: ${props => props.$isVisible ? 'block' : 'none'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(10em)'};
  transition: all 0.25s ease;
`;

const FlipInner = styled.div<{ $isFlipped: boolean; $isOpen: boolean }>`
  position: relative;
  border-radius: 0.7em;
  box-shadow: ${props => props.$isOpen ? `0 0 13px ${theme.primaryTextColor}` : `0 0 3px ${theme.primaryTextColor}`};
  transition: all 0.8s ease, box-shadow 0.3s ease;
  transform-style: preserve-3d;
  transform: ${props => props.$isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const CardSide = styled.div<{ $isBack?: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  backface-visibility: hidden;
  transform: ${props => props.$isBack ? 'translate3d(0, 0, 0) rotateY(0deg)' : 'translate3d(0, 0, 0) rotateY(180deg)'};
  z-index: ${props => props.$isBack ? '100' : '1'};
`;

export const CardDeck = forwardRef<CardDeckRef, CardDeckProps>(
  ({ currentCard, onClose, onCategorySelected }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (currentCard) {
        setIsFlipped(true);
      }
    }, [currentCard]);

    useImperativeHandle(ref, () => ({
      drawCard: () => {
        setIsVisible(true);
        setTimeout(() => {
          setIsOpen(true);
        }, 30);
      },
      closeCard: () => {
        setIsOpen(false);
        if (onClose) {
          onClose();
        }
        setTimeout(() => {
          setIsVisible(false);
          setIsFlipped(false);
        }, 200);
      },
    }));

    const handleCardClick = () => {
      setIsOpen(false);
      if (onClose) {
        onClose();
      }
      setTimeout(() => {
        setIsVisible(false);
        setIsFlipped(false);
      }, 200);
    };

    return (
      <>
        {/* Dark overlay */}
        <DarkOverlay $isOpen={isOpen} />

        {/* Flip container */}
        <FlipContainer $isVisible={isVisible} $isOpen={isOpen}>
          <FlipInner $isFlipped={isFlipped} $isOpen={isOpen}>
            {/* Card back */}
            <CardSide $isBack={true}>
              <CardBack onCategorySelected={onCategorySelected} />
            </CardSide>

            {/* Card face */}
            <CardSide onClick={handleCardClick}>
              {currentCard && <CardFace card={currentCard} />}
            </CardSide>
          </FlipInner>
        </FlipContainer>
      </>
    );
  }
);

CardDeck.displayName = 'CardDeck';
