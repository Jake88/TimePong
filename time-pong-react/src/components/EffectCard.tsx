import { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import styled from 'styled-components';
import type { Card } from '@/types/card.types';
import { CardFace } from './CardFace';
import type { CardFaceRef } from './CardFace';
import * as CardTypeIcons from '@/components/icons/CardTypeIcons';
import { useGame } from '@/context/GameContext';
import { theme } from '@/theme';

export interface EffectCardRef {
  roundEnd: () => void;
}

interface EffectCardProps {
  data: Card | null;
  label: string;
  index?: number;
}

type Rarity = 'common' | 'rare' | 'limited' | 'special';

const getRarityColors = (rarity: Rarity) => {
  switch (rarity) {
    case 'limited':
      return {
        soft: theme.limitedSoft,
        highlight: theme.limitedHighlight,
      };
    case 'special':
      return {
        soft: theme.specialSoft,
        highlight: theme.specialHighlight,
      };
    case 'rare':
      return {
        soft: theme.rareSoft,
        highlight: theme.rareHighlight,
      };
    default:
      return {
        soft: theme.commonSoft,
        highlight: theme.commonHighlight,
      };
  }
};

const Container = styled.div`
  position: relative;
  margin: 0 1em;
`;

const Label = styled.h4<{ $isActive: boolean }>`
  position: relative;
  width: 100%;
  font-weight: 100;
  text-align: center;
  margin: 0;
  margin-top: 0.5em;
  text-transform: uppercase;
  font-size: 0.7em;
  line-height: 2em;
  color: ${props => props.$isActive ? theme.secondaryTextColor : theme.lightGrey};
`;

const EffectWrapper = styled.div<{ $isActive: boolean; $rarity?: Rarity }>`
  box-sizing: border-box;
  padding: 0.3em;
  z-index: 1;
  border: 1px solid ${props => props.$isActive && props.$rarity
    ? getRarityColors(props.$rarity).highlight
    : theme.lightGrey};
  border-radius: 0.2em;
  height: 7.2em;
  width: 4.9em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: ${props => props.$isActive ? theme.secondaryTextColor : theme.lightGrey};
  background-color: ${props => props.$isActive && props.$rarity
    ? getRarityColors(props.$rarity).soft
    : theme.primaryBackgroundColor};
  box-shadow: ${props => props.$isActive ? `0 2px 2px ${theme.overlayBackgroundColor}` : 'none'};
  transition: box-shadow 0.5s, transform 0.5s;
  cursor: ${props => props.$isActive ? 'pointer' : 'default'};
`;

const IconWrapper = styled.div`
  flex-grow: 1;
`;

const TypeIcon = styled.div<{ $isActive: boolean; $rarity?: Rarity }>`
  height: 2.7em;
  width: 100%;
  text-align: center;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  color: ${props => props.$isActive && props.$rarity
    ? getRarityColors(props.$rarity).highlight
    : 'inherit'};
`;

const Title = styled.h4`
  position: relative;
  width: 100%;
  font-weight: 100;
  text-align: center;
  margin: 0;
  text-transform: uppercase;
  font-size: 0.7em;
`;

const OverlayWrapper = styled.div<{ $isOverlay: boolean }>`
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  left: 0;
  pointer-events: ${props => props.$isOverlay ? 'auto' : 'none'};
`;

const OverlayInner = styled.div<{ $isOverlay: boolean }>`
  position: absolute;
  opacity: ${props => props.$isOverlay ? '0.7' : '0'};
  transition: opacity 0.5s linear;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${theme.overlayBackgroundColor};
  z-index: ${props => props.$isOverlay ? '900' : '-1'};
`;

const CardWrapper = styled.div<{ $isOpen: boolean; $isFade: boolean; $isAnimating: boolean }>`
  ${theme.cardWrapper}
  border-radius: 10px;
  display: ${props => props.$isOpen || props.$isAnimating ? 'block' : 'none'};
  z-index: 999;
  opacity: ${props => props.$isFade ? '0' : props.$isOpen ? '1' : '0'};
  transform: ${props => props.$isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, -10em, 0)'};
  transition: opacity 0.3s, transform 0.3s linear;
  position: fixed;
  left: 0;
  bottom: 0;
`;

export const EffectCard = forwardRef<EffectCardRef, EffectCardProps>(
  ({ data, label }, ref) => {
    const { removeEffect } = useGame();
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
      // Remove the effect from GameContext if it has expired (duration = 0)
      if (cardData && cardData.duration === 0) {
        removeEffect(cardData);
      }

      setCardData(null);
      setIsOpen(false);
      setIsFade(false);
      cardFaceRef.current?.reset();
    };

    // Get the appropriate icon component
    const getTypeIcon = () => {
      const iconName = label.charAt(0).toUpperCase() + label.slice(1);
      const IconComponent = CardTypeIcons[iconName as keyof typeof CardTypeIcons] as React.FC<any>;
      return IconComponent ? <IconComponent style={{ height: '2.7em', width: '100%' }} fill="currentColor" /> : null;
    };

    const rarity = (cardData?.rarity || 'common') as Rarity;

    return (
      <Container>
        {/* Mini card display */}
        <div>
          <Label $isActive={isActive}>{label}</Label>

          <EffectWrapper
            onClick={toggleCard}
            $isActive={isActive}
            $rarity={isActive ? rarity : undefined}
          >
            <IconWrapper>
              <TypeIcon $isActive={isActive} $rarity={isActive ? rarity : undefined}>
                {getTypeIcon()}
              </TypeIcon>
            </IconWrapper>
            <Title>{cardData?.title || ''}</Title>
          </EffectWrapper>
        </div>

        {/* Dark overlay */}
        <OverlayWrapper $isOverlay={isOverlay}>
          <OverlayInner $isOverlay={isOverlay} />
        </OverlayWrapper>

        {/* Large card info */}
        {cardData && (
          <CardWrapper
            onClick={toggleCard}
            $isOpen={isOpen}
            $isFade={isFade}
            $isAnimating={isAnimating}
          >
            <CardFace ref={cardFaceRef} card={cardData} isEffect={true} />
          </CardWrapper>
        )}
      </Container>
    );
  }
);

EffectCard.displayName = 'EffectCard';
