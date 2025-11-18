import React from 'react';
import { Angel } from '@/components/icons/UtilityIcons';

interface CardBackProps {
  onCategorySelected?: (category: 'drinking' | 'nonDrinking') => void;
}

export const CardBack: React.FC<CardBackProps> = ({ onCategorySelected }) => {
  const handleSelection = (category: 'drinking' | 'nonDrinking') => {
    if (onCategorySelected) {
      onCategorySelected(category);
    }
  };

  // Get NoMercy icon from CardImages - for now using a simple SVG
  const NoMercyIcon = () => (
    <svg className="h-24 w-24" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50s50-22.4,50-50S77.6,0,50,0z M50,90c-22.1,0-40-17.9-40-40s17.9-40,40-40 s40,17.9,40,40S72.1,90,50,90z"/>
      <path d="M70,35L50,55L30,35L20,45l20,20L20,85l10,10l20-20l20,20l10-10L60,65l20-20L70,35z"/>
    </svg>
  );

  // Get logo icon
  const LogoIcon = () => (
    <svg className="h-12 w-full" viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3"/>
      <text x="50" y="60" fontSize="40" textAnchor="middle" fill="currentColor" fontWeight="bold">TP</text>
    </svg>
  );

  return (
    <div className="relative h-[28.75em] w-[18.75em] rounded-[0.7em] border-[0.2em] border-[var(--common-highlight)] bg-[var(--common-soft-tint)] p-[0.2em]">
      <div className="flex h-full flex-col overflow-hidden rounded-[0.7em] border border-[var(--common-highlight)] bg-[var(--common-soft)] text-center text-[var(--secondary-text-color)]">
        <h2 className="m-0 p-2 text-[1.4em] font-normal">Time Pong</h2>

        {/* Panel head */}
        <div className="relative flex h-[2.6em] items-center">
          {/* Left corner */}
          <div className="flex-[1_1_20%] border-b border-[var(--common-soft-tint)]" />

          {/* Center header */}
          <div className="z-[1] box-border flex h-[5.2rem] flex-[1_1_60%] flex-col items-center justify-start rounded-[50%] border border-[var(--common-soft-tint)] bg-[var(--primary-background-color)] pt-2 text-center">
            <LogoIcon />
          </div>

          {/* Right corner */}
          <div className="flex-[1_1_20%] border-b border-[var(--common-soft-tint)]" />
        </div>

        {/* Panel content */}
        <div className="relative box-border flex flex-1 flex-col items-end justify-end rounded-b-[0.7em] bg-[var(--primary-background-color)] p-[0.3em]">
          <div className="w-full">
            <h2 className="mb-2 text-[1.4em] font-normal">Getting drunk?</h2>
            <div className="flex w-full border-t border-[var(--light-grey)]">
              {/* Yes - Drinking */}
              <button
                onClick={() => handleSelection('drinking')}
                className="flex flex-1 cursor-pointer flex-col items-center p-4 transition-colors active:bg-[var(--limited-soft)]"
              >
                <NoMercyIcon />
                <h2 className="mt-2 text-[1.4em] font-normal text-[var(--failure-red)]">Yes</h2>
              </button>

              {/* No - Non-drinking */}
              <button
                onClick={() => handleSelection('nonDrinking')}
                className="flex flex-1 cursor-pointer flex-col items-center p-4 transition-colors active:bg-[var(--rare-soft)]"
              >
                <Angel className="h-24 w-24 text-[var(--rare-highlight)]" fill="currentColor" />
                <h2 className="mt-2 text-[1.4em] font-normal text-[var(--rare-highlight)]">No</h2>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
