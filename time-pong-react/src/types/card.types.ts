/**
 * Card Type Constants
 * Extracted from time-pong-constant-behaviors.html
 */
export const CARD_TYPES = {
  CAULDRON: 'cauldron',
  ACTION: 'action',
  CHALLENGE: 'challenge',
  TRAIT: 'trait',
  ABILITY: 'ability',
  CURSE: 'curse',
  GLOBAL: 'global',
  SPELL: 'spell',
  PERFORM: 'perform',
  DARE: 'dare',
} as const;

export type CardType = typeof CARD_TYPES[keyof typeof CARD_TYPES];

/**
 * Rarity Type Constants
 */
export const RARITY_TYPES = {
  BASIC: 'basic',
  REGULAR: 'regular',
  LIMITED: 'limited',
  SPECIAL: 'special',
  RARE: 'rare',
} as const;

export type RarityType = typeof RARITY_TYPES[keyof typeof RARITY_TYPES];

/**
 * Deck Type Constants
 */
export const DECK_TYPES = {
  CORE: 'core',
  WITCHES_AND_WIZARDS: 'W&W',
  POP_CULTURE: 'popCulture',
  NUDITY: 'nudity',
  ORGASMIC: 'orgasmic',
  STRIP_FLIRT: 'stripFlirt',
  KINKY: 'kinky',
} as const;

export type DeckType = typeof DECK_TYPES[keyof typeof DECK_TYPES];

/**
 * Card Type Help Text
 */
export const HELP_TEXT = {
  trait: [
    'Traits remain until the end of the game.',
    'If duplicate traits are drawn, the trait moves to that player.',
  ],
  ability: ['Abilities have a one time use.'],
  curse: [
    'Curse effects remain until another curse is drawn.',
    'If anyone breaks the curse they drink.',
  ],
  spell: ['Spell effects expire after a specified number of rounds.'],
  dare: [
    "Dare cards provide a 'chicken out' option if you're too embarrassed.",
  ],
} as const;

/**
 * Bold Rule Interface
 * Represents the bottom rules on a card (drink amounts, challenge results, etc.)
 */
export interface BoldRule {
  /** The instruction text */
  instruction: string;
  /** Optional type (e.g., 'success', 'failure', 'punishment', 'chicken') */
  type?: 'success' | 'failure' | 'punishment' | 'chicken';
  /** Whether to hide from non-drinkers */
  hideFromNonDrinkers?: boolean;
}

/**
 * Primary Rule Interface (similar to BoldRule, used in some spell cards)
 */
export interface PrimaryRule {
  instruction: string;
  hideFromNonDrinkers?: boolean;
}

/**
 * Restrict Interface
 * Used to restrict the type of card that can be drawn next
 */
export interface Restrict {
  type?: CardType;
  rarity?: RarityType;
  multipleLosers?: boolean;
  multi?: boolean;
}

/**
 * Main Card Interface
 */
export interface Card {
  /** Who created the idea for this card */
  creator: string;
  /** Date the card was created */
  created: string;
  /** Whether this card should appear for drinkers */
  forDrinkers?: boolean;
  /** Whether this card should appear for non-drinkers */
  forNonDrinkers?: boolean;
  /** The deck/set/expansion this card came from */
  deck: string;
  /** The rarity level of this card */
  rarity: RarityType;
  /** The type of card */
  type: CardType;
  /** Card style (e.g., 'default', 'challenge', 'ability') */
  card?: string;
  /** Image identifier for the card */
  image?: string;
  /** The title of the card */
  title?: string;
  /** Humorous flavour text for the card */
  flavour?: string;
  /** Whether this card makes sense if multiple people lost */
  multipleLosers?: boolean;
  /** List of instructions to do for the card */
  rules?: string[];
  /** Bottom rules, drink amount / challenge result etc */
  boldRules?: BoldRule[];
  /** Primary rule (used in some spell cards instead of boldRules) */
  primaryRule?: PrimaryRule;
  /** Should this card appear more than once in a single session? */
  oneHitWonder?: boolean;
  /** If the card should last for X rounds (primarily for Spells) */
  duration?: number;
  /** Restricts the type of card that can be drawn next */
  restrict?: Restrict;
  /** Help text for special card types */
  helpText?: string[];
  /** Limit type (deprecated/unused property) */
  limit?: string;
}

/**
 * Rarity Bounds
 * Probability thresholds for drawing cards of each rarity
 */
export const RARITY_BOUNDS = {
  basic: 20,
  regular: 62,
  limited: 85,
  special: 97,
  rare: 100,
} as const;
