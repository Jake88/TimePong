import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useGame } from '@/context/GameContext';
import { CardFace } from '@/components/CardFace';
import type { Card } from '@/types/card.types';
import { theme } from '@/theme';

const Container = styled.div`
  min-height: 100vh;
  padding-bottom: 2em;
`;

const Content = styled.div`
  padding: 0 1em;
  padding-top: 1em;
`;

const FiltersSection = styled.div`
  margin-bottom: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 1em;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5em;
  font-size: 0.875em;
  font-weight: 500;
  color: ${theme.secondaryTextColor};
`;

const Select = styled.select`
  width: 100%;
  border-radius: 0.5em;
  border: 1px solid ${theme.lightGrey};
  background-color: ${theme.primaryBackgroundColor};
  padding: 0.5em 1em;
  color: ${theme.primaryTextColor};
  font-size: 1em;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.limitedHighlight};
    box-shadow: 0 0 0 3px ${theme.limitedSoft};
  }
`;

const CardCount = styled.h3`
  margin-bottom: 1.5em;
  text-align: center;
  font-size: 1.25em;
  color: ${theme.secondaryTextColor};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5em;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CardItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const CreatorText = styled.p`
  margin-bottom: 0.5em;
  text-align: center;
  font-size: 0.875em;
  color: ${theme.lightGrey};
`;

const CardWrapper = styled.div`
  position: relative;
  margin: 0 auto;
  height: 28.75em;
  width: 18.75em;
  border-radius: 0.7em;
  box-shadow: 0 3px 3px ${theme.lightGrey};
`;

const NoCardsSection = styled.div`
  margin-top: 3em;
  text-align: center;
`;

const NoCardsText = styled.p`
  font-size: 1.125em;
  color: ${theme.secondaryTextColor};
  margin-bottom: 1em;
`;

const ClearButton = styled.button`
  border-radius: 0.5em;
  background-color: ${theme.limitedHighlight};
  padding: 0.5em 1.5em;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

export default function CardListPage() {
  const { getAllCards } = useGame();

  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');

  // Get all cards
  const allCards = getAllCards();

  // Card properties for filtering
  const cardProperties = [
    { code: '', label: 'None' },
    { code: 'type', label: 'Type' },
    { code: 'rarity', label: 'Rarity' },
    { code: 'deck', label: 'Expansion' },
    { code: 'forDrinkers', label: 'For Drinkers' },
    { code: 'forNonDrinkers', label: 'For Non-Drinkers' },
  ];

  // Get property options based on selected property
  const propertyOptions = useMemo(() => {
    if (!selectedProperty) return [];

    const options = allCards
      .map((card) => {
        const value = card[selectedProperty as keyof Card];
        if (value === undefined || value === null) return null;
        if (typeof value === 'boolean') return value.toString();
        return String(value);
      })
      .filter((value): value is string => value !== null);

    return Array.from(new Set(options)).sort();
  }, [selectedProperty, allCards]);

  // Filter cards based on selections
  const filteredCards = useMemo(() => {
    if (!selectedProperty || !selectedOption) return allCards;

    return allCards.filter((card) => {
      const value = card[selectedProperty as keyof Card];

      if (typeof value === 'boolean') {
        return value.toString() === selectedOption;
      }

      return String(value) === selectedOption;
    });
  }, [selectedProperty, selectedOption, allCards]);

  // Handle property selection
  const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const property = e.target.value;
    setSelectedProperty(property);
    setSelectedOption('');
  };

  // Handle option selection
  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <Container>
      <Content>
        {/* Filters */}
        <FiltersSection>
          {/* Card property dropdown */}
          <FilterGroup>
            <Label htmlFor="property-select">
              Card Property
            </Label>
            <Select
              id="property-select"
              value={selectedProperty}
              onChange={handlePropertyChange}
            >
              {cardProperties.map((prop) => (
                <option key={prop.code} value={prop.code}>
                  {prop.label}
                </option>
              ))}
            </Select>
          </FilterGroup>

          {/* Property option dropdown */}
          {selectedProperty && propertyOptions.length > 0 && (
            <FilterGroup>
              <Label htmlFor="option-select">
                Property Option
              </Label>
              <Select
                id="option-select"
                value={selectedOption}
                onChange={handleOptionChange}
              >
                <option value="">Select an option</option>
                {propertyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FilterGroup>
          )}
        </FiltersSection>

        {/* Card count */}
        <CardCount>
          {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''} found
        </CardCount>

        {/* Cards grid */}
        <CardsGrid>
          {filteredCards.map((card, index) => (
            <CardItem key={`${card.title}-${index}`}>
              {/* Creator */}
              <CreatorText>
                Creator: {card.creator}
              </CreatorText>

              {/* Card wrapper */}
              <CardWrapper>
                <CardFace card={card} />
              </CardWrapper>
            </CardItem>
          ))}
        </CardsGrid>

        {/* No cards message */}
        {filteredCards.length === 0 && (
          <NoCardsSection>
            <NoCardsText>
              No cards found with the selected filters.
            </NoCardsText>
            <ClearButton
              onClick={() => {
                setSelectedProperty('');
                setSelectedOption('');
              }}
            >
              Clear Filters
            </ClearButton>
          </NoCardsSection>
        )}
      </Content>
    </Container>
  );
}
