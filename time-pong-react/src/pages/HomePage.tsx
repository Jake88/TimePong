import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/theme';

const Container = styled.div`
  height: calc(100vh - 3.5em);
  width: 100%;
  position: relative;
  overflow-y: auto;
  padding: 1em;
`;

const TodoTitle = styled.h3`
  margin-left: 2.5em;
  color: ${theme.primaryTextColor};
  cursor: pointer;
  user-select: none;

  &:hover {
    color: ${theme.secondaryTextColor};
  }
`;

const TodoList = styled.ul<{ $show: boolean }>`
  display: ${props => props.$show ? 'block' : 'none'};
  list-style: disc;
  margin: 1em 0;
  padding-left: 4em;
  color: ${theme.secondaryTextColor};
`;

const TodoItem = styled.li`
  margin-bottom: 0.625em;
  line-height: 1.5;
`;

// ============================================================================
// TODO ITEMS - ORGANIZED BY CATEGORY
// ============================================================================

// 📋 USER SETTINGS & CUSTOMIZATION (CODE-ONLY) - HIGH PRIORITY
// ============================================================================
const userSettingsItems = [
  '⚙️ User Settings Page - Create a new page/route for app configuration (localStorage-based)',
  '  └─ Min/max timer duration (currently hardcoded 2-40 seconds)',
  '  └─ Number of rounds until "game end" (currently hardcoded to 10)',
  '  └─ Game mode selection with dynamic forms:',
  '     • Endless Mode: Random cards drawn indefinitely (current behavior)',
  '     • Rounds Mode: Play until X rounds complete (configurable round count)',
  '     • Set Deck Mode: Fixed deck of specific cards (configurable card selection)',
  '  └─ Card pack toggles (enable/disable specific decks: core, W&W, popCulture, nudity, orgasmic)',
  '  └─ Rarity distribution customization (adjust probability of basic/regular/limited/special/rare)',
  '  └─ Audio settings (timer bell volume, enable/disable sounds)',
  '  └─ Animation preferences (fade speed, performance mode toggle)',
  '  └─ Display preferences (card back style, color theme)',
  '  └─ Drinking mode default (default to drinking/non-drinking on game start)',
];

// 🎮 GAME MECHANICS IMPROVEMENTS (CODE-ONLY)
// ============================================================================
const gameMechanicsItems = [
  '🎯 Improve round counter UI - Make end-game more prominent, add restart/continue options',
  '⚡ No-ball mode - Quick timing/reflex game for device passing (like Paul Davis showed)',
  '🎲 Consolidate card types - Review trait/ability/perform consolidation into action/global types',
  '🎭 Refactor card classification - Some cards should be ability/trait to avoid unwanted draws during action requirements',
  '🔄 Redesign card filter system - Build unified restrictTo object for cleaner filtering logic',
  '📊 Adjust rarity tiers - Consider reducing from 5 to 3-4 tiers, rebalance probabilities',
  '👥 Player count awareness - Track player count and adjust global card frequency accordingly',
  '⏱️ Pacing improvements - Favor quicker cards, avoid cards that remove players from table (Tuna\'s feedback)',
];

// 🎨 UI/UX ENHANCEMENTS (CODE-ONLY)
// ============================================================================
const uiUxItems = [
  '❓ Rules and help popup - Add info icon with game rules and card type explanations',
  '🔔 Fix timer bell - Verify audio playback works reliably on all devices',
  '✨ Test mobile animations - Ensure fade in/out animations are fluid on mobile devices',
  '🚀 Mobile performance - Add translate3d(0,0,0) to body tag for hardware acceleration',
  '🎴 Visual card variety - Different patterns for card types while maintaining consistency (Dil\'s suggestion)',
  '🎯 Function cards UI - Design and implement function card display (if different from current)',
];

// 🃏 CARD CONTENT ADDITIONS (CODE-ONLY)
// ============================================================================
const cardContentItems = [
  '🍺 Add "link arms and drink" card',
  '🎤 Add David Attenborough impression card (narrate taking 2 drinks)',
  '😈 Add wedgie dare card',
  '🌍 Add more global cards for group involvement',
  '💋 Create strip/flirt pack (new deck type)',
  '🔥 Create kinky/hardcore pack (new deck type)',
];

// 🔧 INFRASTRUCTURE & BACKEND (REQUIRES FIREBASE/EXTERNAL SERVICES)
// ============================================================================
const infrastructureItems = [
  '🔥 Firebase card storage - Move card list to Firestore with user config for unlocked packs',
  '🔐 Firebase Auth - Google authentication with userConfig (unlocked packs, preferences)',
  '📚 Deck list management - CRUD operations for user-created deck lists',
  '🎨 Card creation GUI - Tool for users to create custom cards/decks',
  '💰 Monetization system - Free base game with paid expansions or round-based payments',
  '🎟️ Daily/weekly round limits - Free rounds with option to purchase more',
];

// 🎯 DESIGN DECISIONS & BRAINSTORMING
// ============================================================================
const brainstormingItems = [
  '💭 Rarity naming - Finalize tier names (Basic/Common/Rare vs Epic/Legendary/Mythical)',
  '🤔 "scott free" - Clarify what this means',
  '💡 Function cards concept - Define what function cards should do',
];

// Combine all items for display
const todoItems = [
  '═══════════════════════════════════════════════════════════════',
  '📋 USER SETTINGS & CUSTOMIZATION (CODE-ONLY) - HIGH PRIORITY',
  '═══════════════════════════════════════════════════════════════',
  ...userSettingsItems,
  '',
  '═══════════════════════════════════════════════════════════════',
  '🎮 GAME MECHANICS IMPROVEMENTS (CODE-ONLY)',
  '═══════════════════════════════════════════════════════════════',
  ...gameMechanicsItems,
  '',
  '═══════════════════════════════════════════════════════════════',
  '🎨 UI/UX ENHANCEMENTS (CODE-ONLY)',
  '═══════════════════════════════════════════════════════════════',
  ...uiUxItems,
  '',
  '═══════════════════════════════════════════════════════════════',
  '🃏 CARD CONTENT ADDITIONS (CODE-ONLY)',
  '═══════════════════════════════════════════════════════════════',
  ...cardContentItems,
  '',
  '═══════════════════════════════════════════════════════════════',
  '🔧 INFRASTRUCTURE & BACKEND (REQUIRES FIREBASE)',
  '═══════════════════════════════════════════════════════════════',
  ...infrastructureItems,
  '',
  '═══════════════════════════════════════════════════════════════',
  '🎯 DESIGN DECISIONS & BRAINSTORMING',
  '═══════════════════════════════════════════════════════════════',
  ...brainstormingItems,
];

export default function HomePage() {
  const [showList, setShowList] = useState(false);

  const toggleList = () => {
    setShowList(!showList);
  };

  return (
    <Container>
      <TodoTitle onClick={toggleList}>TODO</TodoTitle>
      <TodoList $show={showList}>
        {todoItems.map((item, index) => (
          <TodoItem key={index}>{item}</TodoItem>
        ))}
      </TodoList>
    </Container>
  );
}
