import { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import type { Card } from '@/types/card.types';
import { CardFace } from './CardFace';
import type { CardFaceRef } from './CardFace';
import * as CardTypeIcons from '@/components/icons/CardTypeIcons';

export interface EffectCardRef {
  roundEnd: () => void;
}

interface EffectCardProps {
  data: Card | null;
  label: string;
  index?: number;
}

export const EffectCard = forwardRef<EffectCardRef, EffectCardProps>(
  ({ data, label }, ref) => {
    const [isActive, setIsActive] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOverlay, setIsOverlay] = useState(false);
    const [isFade, setIsFade] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [cardData, setCardData] = useState<Card | null>(data);
    const cardFaceRef = useRef<CardFaceRef>(null);

    useEffect(() => {
      setCardData(data);
      setIsActive(data !== null && !!data.title);
    }, [data]);

    useImperativeHandle(ref, () => ({
      roundEnd: () => {
        if (cardData && cardData.duration) {
          const newDuration = cardData.duration - 1;
          setCardData({ ...cardData, duration: newDuration });

          if (newDuration === 0) {
            setTimeout(() => {
              expire();
            }, 200);
          }
        }
      },
    }));

    const expire = () => {
      toggleCard();
      cardFaceRef.current?.expire();
    };

    const toggleCard = () => {
      if (!cardData) return;

      if (!isAnimating) {
        setIsAnimating(true);

        setTimeout(() => {
          if (cardData.duration === 0 && isOpen) {
            fade();
          } else {
            setIsOpen(!isOpen);
          }
          setIsOverlay(!isOverlay);
          setTimeout(() => {
            stopAnimating();
          }, 400);
        }, 40);
      }
    };

    const stopAnimating = () => {
      if (!isOpen) {
        // Card is closing, hide it
      }
      setIsAnimating(false);
    };

    const fade = () => {
      setIsFade(true);
      setIsActive(false);
      setTimeout(() => {
        clearEffect();
      }, 300);
    };

    const clearEffect = () => {
      setCardData(null);
      setIsOpen(false);
      setIsFade(false);
      cardFaceRef.current?.reset();
    };

    // Get the appropriate icon component
    const getTypeIcon = () => {
      const iconName = label.charAt(0).toUpperCase() + label.slice(1);
      const IconComponent = CardTypeIcons[iconName as keyof typeof CardTypeIcons] as React.FC<any>;
      return IconComponent ? <IconComponent className="mx-auto mb-2 mt-2 h-[2.7em] w-full text-center" fill="currentColor" /> : null;
    };

    return (
      <div className="relative">
        {/* Mini card display */}
        <div>
          <h4
            className={`relative m-0 mt-2 w-full text-center text-[0.7em] font-light uppercase leading-8 transition-colors ${
              isActive ? 'text-[var(--secondary-text-color)]' : 'text-[var(--light-grey)]'
            }`}
          >
            {label}
          </h4>

          <div
            onClick={toggleCard}
            className={`z-[1] box-border flex h-[7.2em] w-[4.9em] flex-col justify-start rounded-[0.2em] border p-[0.3em] transition-all ${
              isActive
                ? `cursor-pointer shadow-[0_2px_2px_var(--overlay-background-color)] ${
                    cardData?.rarity === 'limited'
                      ? 'border-[var(--limited-highlight)] bg-[var(--limited-soft)] text-[var(--limited-highlight)]'
                      : cardData?.rarity === 'special'
                      ? 'border-[var(--special-highlight)] bg-[var(--special-soft)] text-[var(--special-highlight)]'
                      : cardData?.rarity === 'rare'
                      ? 'border-[var(--rare-highlight)] bg-[var(--rare-soft)] text-[var(--rare-highlight)]'
                      : 'border-[var(--common-highlight)] bg-[var(--common-soft)] text-[var(--common-highlight)]'
                  }`
                : 'border-[var(--light-grey)] bg-[var(--primary-background-color)] text-[var(--light-grey)]'
            }`}
          >
            <div className="flex-grow">
              {getTypeIcon()}
            </div>
            <h4 className="m-0 w-full text-center text-[0.7em] font-light uppercase">
              {cardData?.title || ''}
            </h4>
          </div>
        </div>

        {/* Dark overlay */}
        <div className="fixed left-0 top-0 h-full w-full">
          <div
            className={`absolute left-0 top-0 h-full w-full bg-[var(--overlay-background-color)] transition-opacity duration-500 ${
              isOverlay ? 'z-[900] opacity-70' : 'opacity-0'
            }`}
          />
        </div>

        {/* Large card info */}
        {cardData && (
          <div
            onClick={toggleCard}
            className={`fixed left-0 bottom-0 z-[999] rounded-[10px] transition-all duration-300 ${
              isOpen ? 'translate-y-0 opacity-100' : '-translate-y-[10em] opacity-0'
            } ${isFade ? 'opacity-0' : ''}`}
            style={{
              display: isOpen || isAnimating ? 'block' : 'none',
            }}
          >
            <CardFace ref={cardFaceRef} card={cardData} isEffect={true} />
          </div>
        )}
      </div>
    );
  }
);

EffectCard.displayName = 'EffectCard';
