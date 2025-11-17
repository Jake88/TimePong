# TimePong - React + TypeScript Edition

A complete rewrite of the TimePong drinking game from Polymer 1.x to modern React + TypeScript stack.

## 🎮 What is TimePong?

TimePong is a card-based drinking game with a timer. Players draw cards when the timer runs out, and each card has different effects, challenges, and actions. The game includes spells, curses, challenges, and various card types that make the game dynamic and entertaining.

## ✨ Features

- **73 Unique Cards** with different rarities and effects
- **Animated Timer** with sound effects
- **3D Card Flip Animations**
- **Spell & Curse System** with duration tracking
- **Truth or Dare Cards** with 74 truth questions
- **Card Filtering** by type, rarity, and deck
- **Progressive Web App** (PWA) - install on mobile devices
- **Firebase Integration** (optional) for future online features
- **Fully Responsive** - works on all screen sizes

## 🚀 Tech Stack Migration

### Before (Polymer 1.x):
- Polymer 1.2.0
- Bower for dependencies
- Gulp build system
- No TypeScript
- Paper Elements (Material Design)
- Page.js routing

### After (Modern React):
- **React 19** + **TypeScript**
- **Vite** build system
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router v7** for routing
- **Context API** for state management
- **Vite PWA** plugin for Progressive Web App features
- **Firebase SDK v12** for backend integration

## 📁 Project Structure

```
time-pong-react/
├── public/                    # Static assets
│   ├── manifest-icon-192.png
│   ├── manifest-icon-512.png
│   └── apple-touch-icon.png
├── src/
│   ├── assets/               # Images and sounds
│   │   ├── images/
│   │   └── sounds/
│   ├── components/           # React components
│   │   ├── icons/           # SVG icon components (80 icons)
│   │   ├── Timer.tsx
│   │   ├── CardDeck.tsx
│   │   ├── CardFace.tsx
│   │   ├── CardBack.tsx
│   │   └── EffectCard.tsx
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   ├── GamePage.tsx
│   │   └── CardListPage.tsx
│   ├── context/             # State management
│   │   └── GameContext.tsx
│   ├── types/               # TypeScript definitions
│   │   └── card.types.ts
│   ├── data/                # Card database
│   │   ├── cards.json       # 73 cards
│   │   └── truth-questions.json  # 74 truth questions
│   ├── lib/                 # Utilities
│   │   ├── utils.ts
│   │   └── firebase.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── firebase.json            # Firebase configuration
├── database.rules.json      # Database security rules
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Install Dependencies

```bash
cd time-pong-react
npm install
```

### Firebase Configuration (Optional)

If you want to use Firebase features:

1. Create a Firebase project at https://console.firebase.google.com/
2. Copy `.env.example` to `.env`
3. Fill in your Firebase configuration values in `.env`

```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Firebase

```bash
npm run deploy
```

## 🎯 How to Play

1. **Start the Game** - Navigate to `/game`
2. **Choose Your Mode** - Select "Getting Drunk?" or "Staying Sober?"
3. **Wait for the Timer** - The timer runs for 2-40 seconds randomly
4. **Draw a Card** - When the timer finishes, a card is automatically drawn
5. **Follow Instructions** - Read and follow the card's rules
6. **Continue Playing** - Click to close the card and start the next round

### Card Types

- **Action** - Simple actions or drinking assignments
- **Challenge** - Skill-based challenges with success/failure outcomes
- **Spell** - Positive effects that last multiple rounds
- **Curse** - Negative effects that last multiple rounds
- **Global** - Rules that apply to all players
- **Trait** - Ongoing conditions for specific players
- **Dare** - Truth or Dare style cards
- **Ability** - Special one-time powers

### Rarity System

Cards are drawn with different probabilities:
- **Basic** (20%) - Common cards that appear frequently
- **Regular** (42%) - Standard cards
- **Limited** (23%) - Less common cards
- **Special** (12%) - Rare cards with special effects
- **Rare** (3%) - Very rare, powerful cards

## 🔧 Development Guide

### State Management

The app uses React Context API for global state management. See `src/context/GameContext.tsx` for:
- Card drawing logic
- Effect management (spells/curses)
- Round tracking
- One-hit wonder tracking
- Truth question management

### Adding New Cards

1. Edit `src/data/cards.json`
2. Follow the `Card` interface from `src/types/card.types.ts`
3. The card will automatically appear in the game

### Customizing Styles

- Global styles: `src/index.css`
- Tailwind configuration: Tailwind CSS v4 uses `@import "tailwindcss"` in CSS
- CSS variables: Defined in `:root` in `index.css`

### Icon System

80 SVG icons are available as React components in `src/components/icons/`:

```tsx
import { Cauldron, Fetch, Duration } from '@/components/icons';

<Cauldron size={50} fill="#9c27b0" />
```

## 📊 Migration Statistics

- **Original Codebase**: 15 Polymer components, ~3000 lines
- **New Codebase**: React components, TypeScript, fully typed
- **Cards Extracted**: 73 cards across 8 card types
- **Icons Converted**: 80 SVG icons to React components
- **Truth Questions**: 74 questions for dare cards
- **Build Time**: ~1.5 seconds (vs ~10+ seconds with Polymer/Gulp)
- **Bundle Size**: 313 KB JavaScript (gzipped: 98 KB)

## 🚀 Deployment

### Firebase Hosting

```bash
# Login to Firebase
firebase login

# Initialize (if not already done)
firebase init

# Build and deploy
npm run deploy
```

### Other Platforms

The app is a static SPA that can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Just point to the `dist/` directory after building.

## 📝 License

This project is the property of Jake Turner.

## 🎉 Credits

- **Original Creator**: Jake Turner
- **Additional Cards**: Tim Weightman, Dejan and Dragana, "Cute Ben"
- **Migration to React**: Completed November 2025

## 🔮 Future Enhancements

- [ ] User authentication with Firebase
- [ ] Online multiplayer mode
- [ ] Custom card creation
- [ ] Card pack system (unlockables)
- [ ] Leaderboards and statistics
- [ ] Sound effect customization
- [ ] More card packs (Nudity, Orgasmic decks planned)
- [ ] Achievement system

---

**Enjoy responsibly! 🍺**
