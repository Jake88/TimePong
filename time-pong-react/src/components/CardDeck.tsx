import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import type { Card } from '@/types/card.types';
import { CardFace } from './CardFace';
import { CardBack } from './CardBack';

export interface CardDeckRef {
  drawCard: () => void;
  closeCard: () => void;
}

interface CardDeckProps {
  currentCard: Card | null;
  onClose?: () => void;
  onCategorySelected?: (category: 'drinking' | 'nonDrinking') => void;
}

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
        <div
          className={`fixed left-[-2000px] top-[-2000px] h-[5000px] w-[5000px] bg-[#333] transition-opacity duration-300 ${
            isOpen ? 'z-[4] opacity-50' : '-z-[1] opacity-0'
          }`}
        />

        {/* Flip container */}
        <div
          className={`fixed left-0 bottom-0 z-[4] h-[28.75em] w-[18.75em] transition-all duration-250 ${
            !isVisible ? 'hidden' : ''
          } ${
            isOpen
              ? 'translate-y-0 opacity-100'
              : 'translate-y-[10em] opacity-0'
          }`}
          style={{ perspective: '1000px' }}
        >
          <div
            className={`relative rounded-[0.7em] shadow-[0_0_3px_var(--primary-text-color)] transition-all duration-800 ${
              isOpen ? 'shadow-[0_0_13px_var(--primary-text-color)]' : ''
            } ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Card back */}
            <div
              className="absolute left-0 top-0 z-[100] [backface-visibility:hidden]"
              style={{ transform: 'translate3d(0, 0, 0) rotateY(0deg)' }}
            >
              <CardBack
                onCategorySelected={onCategorySelected}
              />
            </div>

            {/* Card face */}
            <div
              className="absolute left-0 top-0 [backface-visibility:hidden]"
              style={{ transform: 'translate3d(0, 0, 0) rotateY(180deg)' }}
              onClick={handleCardClick}
            >
              {currentCard && <CardFace card={currentCard} />}
            </div>
          </div>
        </div>
      </>
    );
  }
);

CardDeck.displayName = 'CardDeck';
