import { useState } from 'react';
import styled from 'styled-components';
import { useSettings } from '@/context/SettingsContext';
import type { GameMode, CardBackStyle, ColorTheme } from '@/context/SettingsContext';
import type { DeckType } from '@/types/card.types';
import { theme } from '@/theme';
import { useGame } from '@/context/GameContext';

const Container = styled.div`
  height: calc(100vh - 3.5em);
  width: 100%;
  position: relative;
  overflow-y: auto;
  padding: 1em;
`;

const Title = styled.h2`
  color: ${theme.primaryTextColor};
  margin: 0 0 1em 0;
  font-size: 1.5em;
`;

const Section = styled.div`
  margin-bottom: 2em;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 1em;
  border-radius: 8px;
`;

const SectionTitle = styled.h3`
  color: ${theme.secondaryTextColor};
  margin: 0 0 1em 0;
  font-size: 1.2em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5em;
`;

const SettingRow = styled.div`
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

const Label = styled.label`
  color: ${theme.secondaryTextColor};
  font-size: 0.9em;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.5em;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: ${theme.primaryTextColor};
  font-size: 1em;

  &:focus {
    outline: none;
    border-color: ${theme.limitedHighlight};
  }
`;

const Select = styled.select`
  padding: 0.5em;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: ${theme.primaryTextColor};
  font-size: 1em;

  &:focus {
    outline: none;
    border-color: ${theme.limitedHighlight};
  }

  option {
    background-color: #2a2a2a;
    color: ${theme.primaryTextColor};
  }
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 0.5em;
`;

const Checkbox = styled.input`
  width: 1.2em;
  height: 1.2em;
  cursor: pointer;
`;

const RangeInput = styled.input`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  border-radius: 3px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: ${theme.limitedHighlight};
    cursor: pointer;
    border-radius: 50%;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: ${theme.limitedHighlight};
    cursor: pointer;
    border-radius: 50%;
    border: none;
  }
`;

const ValueDisplay = styled.span`
  color: ${theme.primaryTextColor};
  font-size: 0.9em;
  font-weight: bold;
  margin-left: 0.5em;
`;

const Button = styled.button`
  padding: 0.7em 1.5em;
  background-color: ${theme.limitedHighlight};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  margin-right: 0.5em;
  margin-top: 0.5em;

  &:hover {
    background-color: ${theme.specialHighlight};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const DangerButton = styled(Button)`
  background-color: #d32f2f;

  &:hover {
    background-color: #f44336;
  }
`;

const HelpText = styled.p`
  color: ${theme.secondaryTextColor};
  font-size: 0.8em;
  margin: 0.3em 0 0 0;
  opacity: 0.8;
`;

const RarityDistributionGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5em;
  align-items: center;
`;

const RarityLabel = styled.span`
  color: ${theme.secondaryTextColor};
  font-size: 0.9em;
  min-width: 80px;
`;

const CardSelectionContainer = styled.div`
  margin-top: 1em;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 0.5em;
`;

const CardSelectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
`;

const CardSelectionCount = styled.span`
  color: ${theme.secondaryTextColor};
  font-size: 0.9em;
`;

const CardItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5em;
  margin: 0.3em 0;
  background-color: ${props => props.$isSelected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$isSelected ? theme.limitedHighlight : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$isSelected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const CardItemCheckbox = styled(Checkbox)`
  margin-right: 0.8em;
`;

const CardItemInfo = styled.div`
  flex: 1;
`;

const CardItemTitle = styled.span`
  color: ${theme.primaryTextColor};
  font-weight: 500;
`;

const CardItemMeta = styled.span`
  color: ${theme.secondaryTextColor};
  font-size: 0.8em;
  margin-left: 0.5em;
`;

const SearchInput = styled(Input)`
  margin-bottom: 1em;
`;

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings, toggleCardInDeck, clearSelectedDeck } = useSettings();
  const { resetGame, getAllCards } = useGame();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [cardSearchFilter, setCardSearchFilter] = useState('');

  const handleGameModeChange = (mode: GameMode) => {
    updateSettings({ gameMode: mode });
  };

  const handleDeckToggle = (deck: DeckType) => {
    updateSettings({
      enabledDecks: {
        ...settings.enabledDecks,
        [deck]: !settings.enabledDecks[deck],
      },
    });
  };

  const handleRarityChange = (rarity: keyof typeof settings.rarityDistribution, value: number) => {
    updateSettings({
      rarityDistribution: {
        ...settings.rarityDistribution,
        [rarity]: value,
      },
    });
  };

  const handleReset = () => {
    if (showResetConfirm) {
      resetSettings();
      resetGame();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <Container>
      <Title>⚙️ Settings</Title>

      {/* Timer Settings */}
      <Section>
        <SectionTitle>⏱️ Timer Settings</SectionTitle>
        <SettingRow>
          <Label>Minimum Timer Duration (seconds)</Label>
          <RangeInput
            type="range"
            min="1"
            max="30"
            step="1"
            value={settings.timerMin / 1000}
            onChange={(e) => updateSettings({ timerMin: Number(e.target.value) * 1000 })}
          />
          <ValueDisplay>{(settings.timerMin / 1000).toFixed(1)}s</ValueDisplay>
        </SettingRow>
        <SettingRow>
          <Label>Maximum Timer Duration (seconds)</Label>
          <RangeInput
            type="range"
            min="5"
            max="120"
            step="5"
            value={settings.timerMax / 1000}
            onChange={(e) => updateSettings({ timerMax: Number(e.target.value) * 1000 })}
          />
          <ValueDisplay>{(settings.timerMax / 1000).toFixed(1)}s</ValueDisplay>
        </SettingRow>
      </Section>

      {/* Game Mode Settings */}
      <Section>
        <SectionTitle>🎮 Game Mode</SectionTitle>
        <SettingRow>
          <Label>Mode</Label>
          <Select
            value={settings.gameMode}
            onChange={(e) => handleGameModeChange(e.target.value as GameMode)}
          >
            <option value="endless">Endless Mode - Random cards indefinitely</option>
            <option value="rounds">Rounds Mode - Play until X rounds complete</option>
            <option value="setDeck">Set Deck Mode - Fixed deck of specific cards</option>
          </Select>
        </SettingRow>
        {settings.gameMode === 'rounds' && (
          <SettingRow>
            <Label>Number of Rounds</Label>
            <Input
              type="number"
              min="1"
              max="100"
              value={settings.roundsCount}
              onChange={(e) => updateSettings({ roundsCount: Number(e.target.value) })}
            />
            <HelpText>Game will track remaining rounds and notify when complete</HelpText>
          </SettingRow>
        )}
        {settings.gameMode === 'setDeck' && (
          <>
            <SettingRow>
              <Label>Custom Deck Cards</Label>
              <CardSelectionHeader>
                <CardSelectionCount>
                  {settings.selectedCards.length} card{settings.selectedCards.length !== 1 ? 's' : ''} selected
                </CardSelectionCount>
                <Button onClick={clearSelectedDeck}>Clear All</Button>
              </CardSelectionHeader>
            </SettingRow>
            <SettingRow>
              <SearchInput
                type="text"
                placeholder="Search cards by title..."
                value={cardSearchFilter}
                onChange={(e) => setCardSearchFilter(e.target.value)}
              />
              <CardSelectionContainer>
                {getAllCards()
                  .filter((card) =>
                    card.title &&
                    card.title.toLowerCase().includes(cardSearchFilter.toLowerCase())
                  )
                  .map((card) => {
                    const isSelected = card.title ? settings.selectedCards.includes(card.title) : false;
                    return card.title ? (
                      <CardItem
                        key={card.title}
                        $isSelected={isSelected}
                        onClick={() => card.title && toggleCardInDeck(card.title)}
                      >
                        <CardItemCheckbox
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <CardItemInfo>
                          <CardItemTitle>{card.title}</CardItemTitle>
                          <CardItemMeta>
                            {card.type} • {card.rarity} • {card.deck}
                          </CardItemMeta>
                        </CardItemInfo>
                      </CardItem>
                    ) : null;
                  })}
              </CardSelectionContainer>
              <HelpText>
                Select cards to create a custom deck. In Set Deck mode, only these cards will be drawn.
                When all cards are drawn, the deck reshuffles.
              </HelpText>
            </SettingRow>
          </>
        )}
      </Section>

      {/* Player Settings */}
      <Section>
        <SectionTitle>👥 Player Settings</SectionTitle>
        <SettingRow>
          <Label>Number of Players</Label>
          <Input
            type="number"
            min="2"
            max="20"
            value={settings.playerCount}
            onChange={(e) => updateSettings({ playerCount: Number(e.target.value) })}
          />
          <HelpText>Affects frequency of global cards and multi-player interactions</HelpText>
        </SettingRow>
        <SettingRow>
          <Label>Default Drinking Mode</Label>
          <CheckboxRow>
            <Checkbox
              type="checkbox"
              checked={settings.defaultDrinkingMode}
              onChange={(e) => updateSettings({ defaultDrinkingMode: e.target.checked })}
            />
            <span style={{ color: theme.secondaryTextColor }}>Start games in drinking mode</span>
          </CheckboxRow>
        </SettingRow>
      </Section>

      {/* Card Packs */}
      <Section>
        <SectionTitle>🃏 Card Packs</SectionTitle>
        {Object.entries(settings.enabledDecks).map(([deck, enabled]) => (
          <CheckboxRow key={deck}>
            <Checkbox
              type="checkbox"
              checked={enabled}
              onChange={() => handleDeckToggle(deck as DeckType)}
            />
            <Label style={{ margin: 0 }}>{deck === 'W&W' ? 'Witches & Wizards' : deck}</Label>
          </CheckboxRow>
        ))}
      </Section>

      {/* Rarity Distribution */}
      <Section>
        <SectionTitle>🎲 Rarity Distribution</SectionTitle>
        <HelpText style={{ marginBottom: '1em' }}>
          Adjust the probability of drawing cards of each rarity (0-100, cumulative)
        </HelpText>
        <RarityDistributionGrid>
          <RarityLabel>Basic:</RarityLabel>
          <RangeInput
            type="range"
            min="0"
            max="100"
            value={settings.rarityDistribution.basic}
            onChange={(e) => handleRarityChange('basic', Number(e.target.value))}
          />
          <ValueDisplay>{settings.rarityDistribution.basic}%</ValueDisplay>

          <RarityLabel>Regular:</RarityLabel>
          <RangeInput
            type="range"
            min="0"
            max="100"
            value={settings.rarityDistribution.regular}
            onChange={(e) => handleRarityChange('regular', Number(e.target.value))}
          />
          <ValueDisplay>{settings.rarityDistribution.regular}%</ValueDisplay>

          <RarityLabel>Limited:</RarityLabel>
          <RangeInput
            type="range"
            min="0"
            max="100"
            value={settings.rarityDistribution.limited}
            onChange={(e) => handleRarityChange('limited', Number(e.target.value))}
          />
          <ValueDisplay>{settings.rarityDistribution.limited}%</ValueDisplay>

          <RarityLabel>Special:</RarityLabel>
          <RangeInput
            type="range"
            min="0"
            max="100"
            value={settings.rarityDistribution.special}
            onChange={(e) => handleRarityChange('special', Number(e.target.value))}
          />
          <ValueDisplay>{settings.rarityDistribution.special}%</ValueDisplay>

          <RarityLabel>Rare:</RarityLabel>
          <RangeInput
            type="range"
            min="0"
            max="100"
            value={settings.rarityDistribution.rare}
            onChange={(e) => handleRarityChange('rare', Number(e.target.value))}
          />
          <ValueDisplay>{settings.rarityDistribution.rare}%</ValueDisplay>
        </RarityDistributionGrid>
      </Section>

      {/* Audio Settings */}
      <Section>
        <SectionTitle>🔊 Audio</SectionTitle>
        <SettingRow>
          <CheckboxRow>
            <Checkbox
              type="checkbox"
              checked={settings.audioEnabled}
              onChange={(e) => updateSettings({ audioEnabled: e.target.checked })}
            />
            <Label style={{ margin: 0 }}>Enable Sound Effects</Label>
          </CheckboxRow>
        </SettingRow>
        {settings.audioEnabled && (
          <SettingRow>
            <Label>Volume</Label>
            <RangeInput
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.audioVolume}
              onChange={(e) => updateSettings({ audioVolume: Number(e.target.value) })}
            />
            <ValueDisplay>{Math.round(settings.audioVolume * 100)}%</ValueDisplay>
          </SettingRow>
        )}
      </Section>

      {/* Animation Settings */}
      <Section>
        <SectionTitle>✨ Animations</SectionTitle>
        <SettingRow>
          <Label>Animation Speed</Label>
          <RangeInput
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.animationSpeed}
            onChange={(e) => updateSettings({ animationSpeed: Number(e.target.value) })}
          />
          <ValueDisplay>{settings.animationSpeed.toFixed(1)}x</ValueDisplay>
        </SettingRow>
        <SettingRow>
          <CheckboxRow>
            <Checkbox
              type="checkbox"
              checked={settings.performanceMode}
              onChange={(e) => updateSettings({ performanceMode: e.target.checked })}
            />
            <Label style={{ margin: 0 }}>Performance Mode (reduces animations)</Label>
          </CheckboxRow>
        </SettingRow>
      </Section>

      {/* Display Settings */}
      <Section>
        <SectionTitle>🎨 Display</SectionTitle>
        <SettingRow>
          <Label>Card Back Style</Label>
          <Select
            value={settings.cardBackStyle}
            onChange={(e) => updateSettings({ cardBackStyle: e.target.value as CardBackStyle })}
          >
            <option value="default">Default</option>
            <option value="minimal">Minimal</option>
            <option value="ornate">Ornate</option>
          </Select>
        </SettingRow>
        <SettingRow>
          <Label>Color Theme</Label>
          <Select
            value={settings.colorTheme}
            onChange={(e) => updateSettings({ colorTheme: e.target.value as ColorTheme })}
          >
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </Select>
        </SettingRow>
      </Section>

      {/* Reset Section */}
      <Section>
        <SectionTitle>⚠️ Reset</SectionTitle>
        <DangerButton onClick={handleReset}>
          {showResetConfirm ? 'Click Again to Confirm Reset' : 'Reset All Settings to Default'}
        </DangerButton>
        <HelpText>This will reset all settings and game state to default values</HelpText>
      </Section>
    </Container>
  );
}
