import { useState } from 'react';
import styled from 'styled-components';
import { HELP_TEXT } from '@/types/card.types';
import { theme } from '@/theme';

const HelpButton = styled.button`
  position: fixed;
  bottom: 1.5em;
  right: 1.5em;
  width: 3.5em;
  height: 3.5em;
  border-radius: 50%;
  background-color: ${theme.limitedHighlight};
  color: white;
  border: none;
  font-size: 1.5em;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 100;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.specialHighlight};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 200;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 1em;
`;

const PopupContainer = styled.div`
  background-color: ${theme.primaryBackgroundColor};
  border: 2px solid ${theme.limitedHighlight};
  border-radius: 12px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 2em;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1em;
  right: 1em;
  background: none;
  border: none;
  color: ${theme.secondaryTextColor};
  font-size: 1.5em;
  cursor: pointer;
  padding: 0;
  width: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${theme.primaryTextColor};
  }
`;

const Title = styled.h2`
  color: ${theme.primaryTextColor};
  margin: 0 0 1em 0;
  font-size: 1.8em;
`;

const Section = styled.div`
  margin-bottom: 2em;
`;

const SectionTitle = styled.h3`
  color: ${theme.limitedHighlight};
  margin: 0 0 0.5em 0;
  font-size: 1.3em;
`;

const Text = styled.p`
  color: ${theme.secondaryTextColor};
  margin: 0.5em 0;
  line-height: 1.6;
`;

const CardTypeSection = styled.div`
  margin-bottom: 1.5em;
  padding: 1em;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const CardTypeTitle = styled.h4`
  color: ${theme.primaryTextColor};
  margin: 0 0 0.5em 0;
  font-size: 1.1em;
  text-transform: capitalize;
`;

const HelpTextItem = styled.li`
  color: ${theme.secondaryTextColor};
  margin: 0.3em 0;
  line-height: 1.5;
`;

const HelpList = styled.ul`
  margin: 0;
  padding-left: 1.5em;
`;

export default function HelpPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <>
      <HelpButton onClick={togglePopup} aria-label="Help">
        ?
      </HelpButton>

      <Overlay $isOpen={isOpen} onClick={closePopup}>
        <PopupContainer onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={closePopup} aria-label="Close">
            ×
          </CloseButton>

          <Title>❓ Game Rules & Help</Title>

          <Section>
            <SectionTitle>How to Play</SectionTitle>
            <Text>
              1. <strong>Start the Timer:</strong> Tap the timer button to begin. Pass the device around
              as the timer counts down.
            </Text>
            <Text>
              2. <strong>Timer Stops:</strong> When the timer stops, the person holding the device draws
              a card by tapping the timer again.
            </Text>
            <Text>
              3. <strong>Follow the Card:</strong> Complete the challenge, action, or effect shown on
              the card.
            </Text>
            <Text>
              4. <strong>Continue Playing:</strong> Close the card and repeat! The game continues until
              you decide to stop (or run out of rounds in Rounds Mode).
            </Text>
          </Section>

          <Section>
            <SectionTitle>Game Modes</SectionTitle>
            <Text>
              <strong>Endless Mode:</strong> Play indefinitely with random cards drawn from the enabled
              decks. Perfect for casual play sessions.
            </Text>
            <Text>
              <strong>Rounds Mode:</strong> Set a specific number of rounds. The game tracks your progress
              and notifies you when you've completed all rounds.
            </Text>
            <Text>
              <strong>Set Deck Mode:</strong> Create a custom deck with specific cards for a more
              controlled experience.
            </Text>
          </Section>

          <Section>
            <SectionTitle>Card Types</SectionTitle>

            <CardTypeSection>
              <CardTypeTitle>🎯 Action Cards</CardTypeTitle>
              <Text>Simple, one-time actions to perform immediately.</Text>
            </CardTypeSection>

            <CardTypeSection>
              <CardTypeTitle>🏆 Challenge Cards</CardTypeTitle>
              <Text>
                Competitive challenges where players compete. Usually has success/failure outcomes.
              </Text>
            </CardTypeSection>

            <CardTypeSection>
              <CardTypeTitle>🎭 Trait Cards</CardTypeTitle>
              <HelpList>
                {HELP_TEXT.trait.map((text, index) => (
                  <HelpTextItem key={index}>{text}</HelpTextItem>
                ))}
              </HelpList>
            </CardTypeSection>

            <CardTypeSection>
              <CardTypeTitle>⚡ Ability Cards</CardTypeTitle>
              <HelpList>
                {HELP_TEXT.ability.map((text, index) => (
                  <HelpTextItem key={index}>{text}</HelpTextItem>
                ))}
              </HelpList>
            </CardTypeSection>

            <CardTypeSection>
              <CardTypeTitle>😈 Curse Cards</CardTypeTitle>
              <HelpList>
                {HELP_TEXT.curse.map((text, index) => (
                  <HelpTextItem key={index}>{text}</HelpTextItem>
                ))}
              </HelpList>
            </CardTypeSection>

            <CardTypeSection>
              <CardTypeTitle>✨ Spell Cards</CardTypeTitle>
              <HelpList>
                {HELP_TEXT.spell.map((text, index) => (
                  <HelpTextItem key={index}>{text}</HelpTextItem>
                ))}
              </HelpList>
            </CardTypeSection>

            <CardTypeSection>
              <CardTypeTitle>🎤 Perform Cards</CardTypeTitle>
              <Text>Performance-based challenges like impressions, songs, or acts.</Text>
            </CardTypeSection>

            <CardTypeSection>
              <CardTypeTitle>🎲 Dare Cards</CardTypeTitle>
              <HelpList>
                {HELP_TEXT.dare.map((text, index) => (
                  <HelpTextItem key={index}>{text}</HelpTextItem>
                ))}
              </HelpList>
            </CardTypeSection>

            <CardTypeSection>
              <CardTypeTitle>🌍 Global Cards</CardTypeTitle>
              <Text>Affects all players at the table simultaneously.</Text>
            </CardTypeSection>
          </Section>

          <Section>
            <SectionTitle>Tips</SectionTitle>
            <Text>
              • Adjust game settings in the Settings page to customize timer duration, enabled card
              packs, and more!
            </Text>
            <Text>
              • Enable or disable drinking mode based on your group's preferences.
            </Text>
            <Text>
              • Use Performance Mode in settings to reduce animations on slower devices.
            </Text>
            <Text>
              • Some cards have special effects that persist for multiple rounds - watch the effect
              indicators at the top of the screen!
            </Text>
          </Section>
        </PopupContainer>
      </Overlay>
    </>
  );
}
