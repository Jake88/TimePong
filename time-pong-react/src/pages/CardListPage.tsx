import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { CardFace } from '@/components/CardFace';
import type { Card } from '@/types/card.types';

export default function CardListPage() {
  const navigate = useNavigate();
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

  // Handle back navigation
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-8">
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
          Card List
        </h2>

        <div className="w-16" /> {/* Spacer for centering */}
      </header>

      {/* Content */}
      <div className="px-4 pt-16">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          {/* Card property dropdown */}
          <div className="flex-1">
            <label
              htmlFor="property-select"
              className="mb-2 block text-sm font-medium text-[var(--secondary-text-color)]"
            >
              Card Property
            </label>
            <select
              id="property-select"
              value={selectedProperty}
              onChange={handlePropertyChange}
              className="w-full rounded-lg border border-[var(--light-grey)] bg-[var(--secondary-bg)] px-4 py-2 text-[var(--primary-text-color)] focus:border-[var(--limited-highlight)] focus:outline-none focus:ring-2 focus:ring-[var(--limited-highlight)] focus:ring-opacity-50"
            >
              {cardProperties.map((prop) => (
                <option key={prop.code} value={prop.code}>
                  {prop.label}
                </option>
              ))}
            </select>
          </div>

          {/* Property option dropdown */}
          {selectedProperty && propertyOptions.length > 0 && (
            <div className="flex-1">
              <label
                htmlFor="option-select"
                className="mb-2 block text-sm font-medium text-[var(--secondary-text-color)]"
              >
                Property Option
              </label>
              <select
                id="option-select"
                value={selectedOption}
                onChange={handleOptionChange}
                className="w-full rounded-lg border border-[var(--light-grey)] bg-[var(--secondary-bg)] px-4 py-2 text-[var(--primary-text-color)] focus:border-[var(--limited-highlight)] focus:outline-none focus:ring-2 focus:ring-[var(--limited-highlight)] focus:ring-opacity-50"
              >
                <option value="">Select an option</option>
                {propertyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Card count */}
        <h3 className="mb-6 text-center text-xl text-[var(--secondary-text-color)]">
          {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''} found
        </h3>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCards.map((card, index) => (
            <div key={`${card.title}-${index}`} className="flex flex-col">
              {/* Creator */}
              <p className="mb-2 text-center text-sm text-[var(--light-grey)]">
                Creator: {card.creator}
              </p>

              {/* Card wrapper */}
              <div className="relative mx-auto h-[460px] w-[300px] rounded-[0.7em] shadow-[0_3px_3px_#ccc]">
                <CardFace card={card} />
              </div>
            </div>
          ))}
        </div>

        {/* No cards message */}
        {filteredCards.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-[var(--secondary-text-color)]">
              No cards found with the selected filters.
            </p>
            <button
              onClick={() => {
                setSelectedProperty('');
                setSelectedOption('');
              }}
              className="mt-4 rounded-lg bg-[var(--limited-highlight)] px-6 py-2 text-white transition-all hover:bg-opacity-90"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
