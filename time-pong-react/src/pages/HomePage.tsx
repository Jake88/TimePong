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

const todoItems = [
  'Move the card list to a Firebase store and get it coming back using a (hardcoded) user config that allows all cards from `default` category',
  'Then setup Firebase/Google auth. User objects should return with a userConfig that includes unlocked packs',
  'UserConfig should also have an array of `deck lists` they have put together - also a list of pre-defined lists',
  'They should be able to create, update, delete deck lists',
  'Probably recreate the app in Polymer 2.0 - try to tidy it up a bit more. Componentise and abrast logic a bit better',
  'Redesign card filter. We should build a restrictTo object which we then simply filter by _.filter(cardList, restrictToObj)',
  'Add a card for linking arms and drinking',
  'Add a round counter? The game should probably have an end point instead of being an endless cycle.',
  'On that, Monetisation options: Free base game, $ for expansions. || Pay per round || Video and ads?',
  'Possible monetisation - If I give X drink rounds for free each day or week, the user can purchase more drink rounds for $',
  'Dil says: Not all cards need to look identical. I could have different patterns to depict different card types. Note though that these must still share similarities so users aren\'t completely confused.',
  'Card idea: Using your best david attenbourough impression, narrate yourself taking 2 drinks',
  'Put translate3d(0,0,0) on the body tag to see if it improves animation performance on mobile.',
  'Create a GUI for card creation. People can create decks (or single cards?) of cards that can be viewed and included in the game',
  'Basic, Common, Rare, (Epic or legendary or special or exquisit or Mythical / mythic or unique)',
  'scott free',
  'Test new fade in / out animations on mobile to ensure theyre fluid.',
  'Fix the timer bell',
  'Rules and help icon with popup.',
  'Function cards?',
  'Refactor some cards to be ability or trait type, to avoid being drawn when an action is required',
  'No ball mode - Add a quick timing / reflex sort of game so people pass round the device - like the game Paul Davis showed',
  'Remove one level of rareness - only 3 - increase the likliness of the rare ones..',
  'Do I try to consolidate trait / ability / perform cards? I could look at changing the limitTo part of cards to be value-only instead, then apply the value only property onto cards that have a value action. This way I can safely consolidate perform cards into action and possibly global into action?',
  'add a wedgie dare?',
  'strip / flirt pack',
  'kiknky / hardcore pack',
  'Tuna says : Cards that make you leave the table are bad, and cards should be quicker - more fast paced.',
  'More \'global\' cards where everyone ahs to drink or whatever to keep larger groups involved. Possibly check how many people are playing before including these into the roster?'
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
