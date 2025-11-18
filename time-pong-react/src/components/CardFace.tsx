import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import styled from 'styled-components';
import type { Card } from '@/types/card.types';
import { HELP_TEXT } from '@/types/card.types';
import * as CardTypeIcons from '@/components/icons/CardTypeIcons';
import * as CardImages from '@/components/icons/CardImages';
import { Duration } from '@/components/icons/UtilityIcons';
import { kebabToPascalCase } from '@/lib/utils';
import { theme } from '@/theme';

export interface CardFaceRef {
  expire: () => void;
  reset: () => void;
}

interface CardFaceProps {
  card: Card;
  isEffect?: boolean;
  isDrinking?: boolean;
}

type Rarity = 'common' | 'rare' | 'limited' | 'special';

const getRarityColors = (rarity: Rarity) => {
  switch (rarity) {
    case 'limited':
      return {
        soft: theme.limitedSoft,
        softTint: theme.limitedSoftTint,
        highlight: theme.limitedHighlight,
      };
    case 'special':
      return {
        soft: theme.specialSoft,
        softTint: theme.specialSoftTint,
        highlight: theme.specialHighlight,
      };
    case 'rare':
      return {
        soft: theme.rareSoft,
        softTint: theme.rareSoftTint,
        highlight: theme.rareHighlight,
      };
    default:
      return {
        soft: theme.commonSoft,
        softTint: theme.commonSoftTint,
        highlight: theme.commonHighlight,
      };
  }
};

const Wrapper = styled.div<{ $rarity: Rarity }>`
  box-sizing: border-box;
  position: relative;
  height: 28.75em;
  width: 18.75em;
  background-color: ${props => getRarityColors(props.$rarity).softTint};
  border: 0.2em solid ${props => getRarityColors(props.$rarity).highlight};
  padding: 0.2em;
  border-radius: 0.7em;
`;

const Panel = styled.div<{ $rarity: Rarity }>`
  border-radius: 0.7em;
  background-color: ${props => getRarityColors(props.$rarity).soft};
  border: 1px solid ${props => getRarityColors(props.$rarity).highlight};
  color: ${theme.secondaryTextColor};
  margin-top: 0.2em;
  position: relative;
  text-align: center;
  overflow: hidden;
  flex-shrink: 0;
`;

const MainPanel = styled(Panel)`
  margin-top: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PanelTitle = styled.h2`
  padding: 0.5em 0;
  margin: 0;
  font-size: 1.4em;
  font-weight: normal;
`;

const PanelHead = styled.div`
  height: 2.6em;
  display: flex;
  flex-direction: row;
  position: relative;
`;

const PanelHeadCorner = styled.div<{ $rarity: Rarity }>`
  flex: 1 1 20%;
  border-bottom: 1px solid ${props => getRarityColors(props.$rarity).softTint};
  color: ${props => getRarityColors(props.$rarity).highlight};
`;

const PanelHeadHeader = styled.div<{ $rarity: Rarity }>`
  box-sizing: border-box;
  background-color: ${theme.primaryBackgroundColor};
  flex: 1 1 60%;
  z-index: 1;
  height: 5.2rem;
  padding-top: 0.5em;
  border-radius: 50%;
  border: 1px solid ${props => getRarityColors(props.$rarity).softTint};
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const TypeLabel = styled.h4`
  position: relative;
  width: 100%;
  text-align: center;
  margin: 0;
  margin-bottom: 0.2rem;
  text-transform: uppercase;
  font-size: 0.7em;
  font-weight: normal;
  color: ${theme.lightGrey};
`;

const TypeIconWrapper = styled.div`
  height: 3em;
  width: 100%;
`;

const DurationWrapper = styled.div`
  width: 100%;
  height: 2.6em;
  position: relative;
`;

const DurationIcon = styled(Duration)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const DurationText = styled.p`
  position: relative;
  margin: 0;
  font-size: 1.5em;
  line-height: 2.6rem;
  color: ${theme.secondaryTextColor};
`;

const PanelContent = styled.div`
  box-sizing: border-box;
  background-color: ${theme.primaryBackgroundColor};
  border-radius: 0 0 0.7em 0.7em;
  padding: 0.3em;
  padding-top: 2.9em;
  font-weight: 100;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const HelpIcon = styled.div<{ $toggled: boolean }>`
  box-sizing: border-box;
  position: absolute;
  color: ${theme.linkColor};
  width: 3.5em;
  height: 3.5em;
  top: 0;
  left: 0;
  padding-top: 0.3em;
  cursor: ${props => props.$toggled ? 'auto' : 'pointer'};

  svg {
    height: 2em;
    width: 2em;
    border-radius: 50%;
    transition: transform 0.3s ease, opacity 0.3s ease;
    ${props => props.$toggled && `
      transform: translate3d(0, 2.7em, 0) scale(0.8);
      opacity: 0.8;
    `}
  }
`;

const HelpContent = styled.div<{ $toggled: boolean }>`
  color: ${theme.linkColor};
  transform: scaleY(${props => props.$toggled ? '1' : '0'});
  transition: transform 0.2s ease;
  transform-origin: top;
  height: ${props => props.$toggled ? 'auto' : '0'};
  padding-left: 2.5em;
  text-align: left;
`;

const RuleText = styled.p`
  font-weight: 100;
  padding: 0.5em;
  margin: 0;

  b {
    font-weight: bold;
  }
`;

const ChallengeWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChallengeItem = styled.div<{ $type?: string }>`
  margin-top: 1em;
  border-top: 1px solid ${props =>
    props.$type === 'success'
      ? theme.successGreen
      : props.$type === 'failure' || props.$type === 'punishment' || props.$type === 'chicken'
      ? theme.failureRed
      : 'transparent'
  };
`;

const ChallengeTitle = styled.h4<{ $type?: string }>`
  position: relative;
  width: 5rem;
  text-align: center;
  margin: -0.4rem auto 0;
  text-transform: uppercase;
  font-size: 0.7em;
  font-weight: normal;
  background-color: ${theme.primaryBackgroundColor};
  color: ${props =>
    props.$type === 'success'
      ? theme.successGreen
      : props.$type === 'failure' || props.$type === 'punishment' || props.$type === 'chicken'
      ? theme.failureRed
      : 'inherit'
  };
`;

const ImageWrapper = styled.div`
  position: relative;
  flex: 1;

  svg {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const FlavourText = styled.p`
  margin: 0;
  padding: 0.5em;
  font-size: 0.8em;
  font-style: oblique;
  color: ${theme.lightGrey};
`;

const ExpiredText = styled.div`
  ${theme.absoluteTemplate}
  height: auto;
  font-size: 4.5em;
  color: ${theme.failureRed};
  bottom: 0;
  top: 9rem;
  text-align: center;
  font-weight: bold;
  text-shadow: 0 1px 1px ${theme.secondaryTextColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExpiredOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: white;
  opacity: 0.7;
  pointer-events: none;
`;

export const CardFace = forwardRef<CardFaceRef, CardFaceProps>(
  ({ card, isDrinking = true }, ref) => {
    const [isExpired, setIsExpired] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [helpText, setHelpText] = useState<string[]>([]);

    useEffect(() => {
      // Reset states when card changes
      setIsExpired(false);
      setShowHelp(false);

      // Set up help text based on card type
      let newHelpText: string[] = [];
      if (card.type && HELP_TEXT[card.type as keyof typeof HELP_TEXT]) {
        newHelpText = [...(HELP_TEXT[card.type as keyof typeof HELP_TEXT])];
      }
      if (card.helpText) {
        newHelpText = newHelpText.concat(card.helpText);
      }
      setHelpText(newHelpText);
    }, [card]);

    useImperativeHandle(ref, () => ({
      expire: () => {
        setIsExpired(true);
      },
      reset: () => {
        setIsExpired(false);
      },
    }));

    const toggleHelp = (e: React.MouseEvent) => {
      if (!isExpired) {
        e.stopPropagation();
        setShowHelp(!showHelp);
      }
    };

    const hideRule = (rule: any) => {
      if (rule.hideFromNonDrinkers && !isDrinking) {
        return true;
      } else if (rule.hideFromDrinkers && isDrinking) {
        return true;
      }
      return false;
    };

    // Get the appropriate icon component
    const getTypeIcon = () => {
      const iconName = card.type.charAt(0).toUpperCase() + card.type.slice(1);
      const IconComponent = CardTypeIcons[iconName as keyof typeof CardTypeIcons] as React.FC<any>;
      return IconComponent ? <IconComponent style={{ height: '3em', width: '100%' }} fill="currentColor" /> : null;
    };

    // Get the appropriate card image component
    const getCardImage = () => {
      if (!card.image) return null;
      // Convert kebab-case to PascalCase (e.g., 'the-witchs-cauldron' -> 'TheWitchsCauldron')
      const componentName = kebabToPascalCase(card.image);
      const ImageComponent = CardImages[componentName as keyof typeof CardImages] as React.FC<any>;
      return ImageComponent ? <ImageComponent fill="currentColor" /> : null;
    };

    const rarity = (card.rarity || 'common') as Rarity;

    return (
      <Wrapper $rarity={rarity}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <MainPanel $rarity={rarity}>
            <PanelTitle>{card.title}</PanelTitle>

            {/* Panel head */}
            <PanelHead>
              {/* Left corner */}
              <PanelHeadCorner $rarity={rarity} />

              {/* Center header */}
              <PanelHeadHeader $rarity={rarity}>
                <TypeLabel>{card.type}</TypeLabel>
                <TypeIconWrapper>
                  {getTypeIcon()}
                </TypeIconWrapper>
              </PanelHeadHeader>

              {/* Right corner with duration */}
              <PanelHeadCorner $rarity={rarity}>
                {card.duration && (
                  <DurationWrapper>
                    <DurationIcon fill="currentColor" />
                    <DurationText>{card.duration}</DurationText>
                  </DurationWrapper>
                )}
              </PanelHeadCorner>
            </PanelHead>

            {/* Panel content */}
            <PanelContent>
              {/* Help icon */}
              {helpText.length > 0 && (
                <HelpIcon $toggled={showHelp} onClick={toggleHelp}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                  </svg>
                </HelpIcon>
              )}

              {/* Help content */}
              {helpText.length > 0 && (
                <HelpContent $toggled={showHelp}>
                  {helpText.map((text, index) => (
                    <RuleText key={index}>{text}</RuleText>
                  ))}
                </HelpContent>
              )}

              {/* Rules */}
              {card.rules &&
                card.rules.map((rule, index) => (
                  <RuleText key={index}>{rule}</RuleText>
                ))}

              {/* Challenge section with bold rules */}
              {card.boldRules && card.boldRules.length > 0 && (
                <ChallengeWrapper>
                  {card.boldRules.map(
                    (rule, index) =>
                      !hideRule(rule) && (
                        <ChallengeItem key={index} $type={rule.type}>
                          {rule.type && (
                            <ChallengeTitle $type={rule.type}>
                              {rule.type}
                            </ChallengeTitle>
                          )}
                          <RuleText>
                            <b>{rule.instruction}</b>
                          </RuleText>
                        </ChallengeItem>
                      )
                  )}
                </ChallengeWrapper>
              )}

              {/* Image wrapper */}
              {card.image && (
                <ImageWrapper>
                  {getCardImage()}
                </ImageWrapper>
              )}

              {/* Flavour text */}
              {card.flavour && (
                <FlavourText>{card.flavour}</FlavourText>
              )}
            </PanelContent>
          </MainPanel>

          {/* Expired overlay */}
          {isExpired && (
            <>
              <ExpiredText>Expired</ExpiredText>
              <ExpiredOverlay />
            </>
          )}
        </div>
      </Wrapper>
    );
  }
);

CardFace.displayName = 'CardFace';
