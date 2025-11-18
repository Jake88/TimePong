import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { DeckType } from '@/types/card.types';

// Game modes
export type GameMode = 'endless' | 'rounds' | 'setDeck';

// Card back styles
export type CardBackStyle = 'default' | 'minimal' | 'ornate';

// Color themes
export type ColorTheme = 'default' | 'dark' | 'light';

// Settings interface
export interface UserSettings {
  // Timer settings
  timerMin: number; // in milliseconds
  timerMax: number; // in milliseconds

  // Game settings
  gameMode: GameMode;
  roundsCount: number;
  selectedCards: string[]; // Card titles for Set Deck mode

  // Card pack settings
  enabledDecks: Record<DeckType, boolean>;

  // Rarity distribution (0-100 for each tier, cumulative)
  rarityDistribution: {
    basic: number;
    regular: number;
    limited: number;
    special: number;
    rare: number;
  };

  // Audio settings
  audioEnabled: boolean;
  audioVolume: number; // 0-1

  // Animation settings
  animationSpeed: number; // multiplier, 1 = normal
  performanceMode: boolean; // reduces animations

  // Display settings
  cardBackStyle: CardBackStyle;
  colorTheme: ColorTheme;

  // Game defaults
  defaultDrinkingMode: boolean;

  // Player count
  playerCount: number;
}

// Default settings
const defaultSettings: UserSettings = {
  timerMin: 2000,
  timerMax: 40000,
  gameMode: 'endless',
  roundsCount: 10,
  selectedCards: [],
  enabledDecks: {
    core: true,
    'W&W': true,
    popCulture: true,
    nudity: false,
    orgasmic: false,
    stripFlirt: false,
    kinky: false,
  },
  rarityDistribution: {
    basic: 20,
    regular: 62,
    limited: 85,
    special: 97,
    rare: 100,
  },
  audioEnabled: true,
  audioVolume: 1,
  animationSpeed: 1,
  performanceMode: false,
  cardBackStyle: 'default',
  colorTheme: 'default',
  defaultDrinkingMode: true,
  playerCount: 2,
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (jsonString: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'timepong_settings';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    // Load settings from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure new settings are included
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
    return defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const exportSettings = useCallback((): string => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  const importSettings = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      // Validate that it's a valid settings object
      if (typeof parsed === 'object' && parsed !== null) {
        setSettings({ ...defaultSettings, ...parsed });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }, []);

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
