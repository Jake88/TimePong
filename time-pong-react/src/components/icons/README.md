# TimePong Icon Components

This directory contains all icon components converted from the original Polymer `iron-iconset-svg` elements to React TypeScript components.

## Overview

All icons are exported as React functional components with TypeScript props. Each icon accepts the following props:

- `className?: string` - CSS class name for styling
- `size?: number | string` - Width and height of the icon (default: 100)
- `fill?: string` - Fill color (default: 'currentColor')
- `style?: React.CSSProperties` - Inline styles

## Icon Sets

### Card Type Icons (10 icons)
Located in `CardTypeIcons.tsx`

- Ability
- Action
- Cauldron
- Challenge
- Curse
- Dare
- Global
- Perform
- Spell
- Trait

### Utility Icons (2 icons)
Located in `UtilityIcons.tsx`

- Angel
- Duration

### Card Images (68 icons)
Located in `CardImages.tsx`

- Anonymous, BallMouth, Chilli, Delay, Delegate, DoingItWrong, DoubleTrouble
- DrinkOne, DrinkTwo, DrinkThree, DrinkFour, DrinkFive
- Duel, Fetch, FlipCup, FreeThrow, Gatekeeper, GiftDrink, GiveAndTake, Gross
- HackySack, HoleInOne, JailFree, JustinBieber, Kamikaze, Kiss, Kobe, Laughter
- LeadCup, LooksCanKill, LoversLane, Multiball, Mute, NoMercy, NoPoint, Nosey
- OneForAll, Orgasmic, Paralyzed, Potion, Punisher, PushUp, Racist
- RedTopsBluePants, Redemption, Rehydrate, ReturnToSender, Rewind, RimJob
- Sharon, SimonSays, SingingCow, SippingSitup, Skull, SnakeEyes, Spicey, SpiltMilk
- TheWitchsCauldron, TheWitchsCurse, TheWizardsHat, Thirsty, ThreesACrowd
- TrickShot, TrippleDees, Twerk, TwoGrills, Waterfall, Yoda

## Usage

### Importing Individual Icons

```typescript
import { Cauldron, Action, Duration } from '@/components/icons';

function MyComponent() {
  return (
    <div>
      <Cauldron size={50} fill="#ff0000" />
      <Action size="2rem" className="action-icon" />
      <Duration size={32} style={{ margin: '10px' }} />
    </div>
  );
}
```

### Importing from Specific Files

```typescript
import { Cauldron, Action } from '@/components/icons/CardTypeIcons';
import { Angel } from '@/components/icons/UtilityIcons';
import { Fetch, Waterfall } from '@/components/icons/CardImages';
```

### Using with Props

```typescript
import { Challenge } from '@/components/icons';

function GameCard() {
  return (
    <div className="card">
      <Challenge
        size={100}
        fill="currentColor"
        className="card-icon"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }}
      />
    </div>
  );
}
```

### TypeScript Types

All icon components export their prop types:

```typescript
import { CauldronProps } from '@/components/icons';

const iconProps: CauldronProps = {
  size: 64,
  fill: '#333',
  className: 'my-icon'
};
```

## Icon Dimensions

All icons use a `viewBox="0 0 100 100"`, maintaining their original aspect ratio and design from the Polymer implementation.

## Styling

Icons inherit the text color by default (`fill="currentColor"`), making them easy to style with CSS:

```css
.icon-container {
  color: #ff6b6b;
}

.icon-container svg {
  /* Icons will be red */
}
```

## Total Icons: 80

- Card Type Icons: 10
- Utility Icons: 2
- Card Images: 68
