import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import type { Card } from '@/types/card.types';
import { HELP_TEXT } from '@/types/card.types';
import * as CardTypeIcons from '@/components/icons/CardTypeIcons';
import { Duration } from '@/components/icons/UtilityIcons';

export interface CardFaceRef {
  expire: () => void;
  reset: () => void;
}

interface CardFaceProps {
  card: Card;
  isEffect?: boolean;
  isDrinking?: boolean;
}

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
      return IconComponent ? <IconComponent className="h-12 w-full" fill="currentColor" /> : null;
    };

    return (
      <div
        className={`relative h-[28.75em] w-[18.75em] rounded-[0.7em] border-[0.2em] p-[0.2em] ${
          card.rarity === 'limited'
            ? 'border-[var(--limited-highlight)] bg-[var(--limited-soft-tint)]'
            : card.rarity === 'special'
            ? 'border-[var(--special-highlight)] bg-[var(--special-soft-tint)]'
            : card.rarity === 'rare'
            ? 'border-[var(--rare-highlight)] bg-[var(--rare-soft-tint)]'
            : 'border-[var(--common-highlight)] bg-[var(--common-soft-tint)]'
        }`}
      >
        <div className="relative flex h-full flex-col overflow-hidden rounded-[0.7em] border bg-[var(--primary-background-color)] text-center text-[var(--secondary-text-color)]">
          {/* Main panel */}
          <div className="flex flex-1 flex-col">
            <h2 className="m-0 p-2 text-[1.4em] font-normal">{card.title}</h2>

            {/* Panel head */}
            <div className="relative flex h-[2.6em] items-center">
              {/* Left corner */}
              <div
                className={`flex-[1_1_20%] border-b ${
                  card.rarity === 'limited'
                    ? 'border-[var(--limited-soft-tint)] text-[var(--limited-highlight)]'
                    : card.rarity === 'special'
                    ? 'border-[var(--special-soft-tint)] text-[var(--special-highlight)]'
                    : card.rarity === 'rare'
                    ? 'border-[var(--rare-soft-tint)] text-[var(--rare-highlight)]'
                    : 'border-[var(--common-soft-tint)] text-[var(--common-highlight)]'
                }`}
              />

              {/* Center header */}
              <div
                className={`z-[1] box-border flex h-[5.2rem] flex-[1_1_60%] flex-col items-center justify-start rounded-[50%] border bg-[var(--primary-background-color)] pt-2 text-center ${
                  card.rarity === 'limited'
                    ? 'border-[var(--limited-soft-tint)]'
                    : card.rarity === 'special'
                    ? 'border-[var(--special-soft-tint)]'
                    : card.rarity === 'rare'
                    ? 'border-[var(--rare-soft-tint)]'
                    : 'border-[var(--common-soft-tint)]'
                }`}
              >
                <h4 className="m-0 mb-[0.2rem] w-full text-center text-[0.7em] font-normal uppercase text-[var(--light-grey)]">
                  {card.type}
                </h4>
                {getTypeIcon()}
              </div>

              {/* Right corner with duration */}
              <div
                className={`flex-[1_1_20%] border-b ${
                  card.rarity === 'limited'
                    ? 'border-[var(--limited-soft-tint)] text-[var(--limited-highlight)]'
                    : card.rarity === 'special'
                    ? 'border-[var(--special-soft-tint)] text-[var(--special-highlight)]'
                    : card.rarity === 'rare'
                    ? 'border-[var(--rare-soft-tint)] text-[var(--rare-highlight)]'
                    : 'border-[var(--common-soft-tint)] text-[var(--common-highlight)]'
                }`}
              >
                {card.duration && (
                  <div className="relative w-full">
                    <Duration className="absolute left-0 top-0 w-full" fill="currentColor" />
                    <p className="relative m-0 text-[1.5em] leading-[2.6rem] text-[var(--secondary-text-color)]">
                      {card.duration}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Panel content */}
            <div className="relative box-border flex flex-1 flex-col rounded-b-[0.7em] bg-[var(--primary-background-color)] px-[0.3em] pb-[0.3em] pt-[2.9em] font-light">
              {/* Help icon */}
              {helpText.length > 0 && (
                <div
                  className={`absolute left-0 top-0 box-border h-[3.5em] w-[3.5em] cursor-pointer pt-[0.3em] text-[var(--link-color)] ${
                    showHelp ? '' : ''
                  }`}
                  onClick={toggleHelp}
                >
                  <svg
                    className={`h-8 w-8 rounded-[50%] transition-all duration-300 ${
                      showHelp ? 'translate-y-[2.7em] scale-[0.8] opacity-80' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                  </svg>
                </div>
              )}

              {/* Help content */}
              {helpText.length > 0 && (
                <div
                  className={`origin-top pl-[2.5em] text-left text-[var(--link-color)] transition-transform duration-200 ${
                    showHelp ? 'h-auto scale-y-100' : 'h-0 scale-y-0'
                  }`}
                >
                  {helpText.map((text, index) => (
                    <p key={index} className="m-0 p-2 font-light">
                      {text}
                    </p>
                  ))}
                </div>
              )}

              {/* Rules */}
              {card.rules &&
                card.rules.map((rule, index) => (
                  <p key={index} className="m-0 p-2 font-light">
                    {rule}
                  </p>
                ))}

              {/* Challenge section with bold rules */}
              {card.boldRules && card.boldRules.length > 0 && (
                <div className="flex flex-col">
                  {card.boldRules.map(
                    (rule, index) =>
                      !hideRule(rule) && (
                        <div
                          key={index}
                          className={`mt-4 flex flex-1 flex-col border-t ${
                            rule.type === 'success'
                              ? 'border-[var(--success-green)]'
                              : rule.type === 'failure' ||
                                rule.type === 'punishment' ||
                                rule.type === 'chicken'
                              ? 'border-[var(--failure-red)]'
                              : ''
                          }`}
                        >
                          {rule.type && (
                            <h4
                              className={`relative m-[-0.4rem] mx-auto my-0 w-[5rem] bg-[var(--primary-background-color)] text-[0.7em] font-normal uppercase ${
                                rule.type === 'success'
                                  ? 'text-[var(--success-green)]'
                                  : rule.type === 'failure' ||
                                    rule.type === 'punishment' ||
                                    rule.type === 'chicken'
                                  ? 'text-[var(--failure-red)]'
                                  : ''
                              }`}
                            >
                              {rule.type}
                            </h4>
                          )}
                          <p className="m-0 p-2 font-light">
                            <b>{rule.instruction}</b>
                          </p>
                        </div>
                      )
                  )}
                </div>
              )}

              {/* Image wrapper - would need CardImages component */}
              {card.image && (
                <div className="relative flex flex-1">
                  {/* Image icon would go here if we had the CardImages component */}
                </div>
              )}

              {/* Flavour text */}
              {card.flavour && (
                <p className="m-0 text-[0.8em] italic text-[var(--light-grey)]">
                  {card.flavour}
                </p>
              )}
            </div>
          </div>

          {/* Expired overlay */}
          {isExpired && (
            <div className="absolute bottom-0 left-0 right-0 top-[9rem] flex items-center justify-center text-center text-[4.5em] font-bold text-[var(--failure-red)] [text-shadow:0_1px_1px_var(--secondary-text-color)]">
              Expired
            </div>
          )}

          {/* Opacity overlay for expired state */}
          {isExpired && (
            <div className="pointer-events-none absolute inset-0 bg-white opacity-70" />
          )}
        </div>
      </div>
    );
  }
);

CardFace.displayName = 'CardFace';
