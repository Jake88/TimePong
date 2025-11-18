import React from 'react';
import styled from 'styled-components';
import { Angel, NoMercy } from '@/components/icons';
import { theme } from '@/theme';

interface CardBackProps {
  onCategorySelected?: (category: 'drinking' | 'nonDrinking') => void;
}

const Wrapper = styled.div`
  box-sizing: border-box;
  position: relative;
  height: 28.75em;
  width: 18.75em;
  background-color: ${theme.commonSoftTint};
  border: 0.2em solid ${theme.commonHighlight};
  padding: 0.2em;
  border-radius: 0.7em;
`;

const Panel = styled.div`
  border-radius: 0.7em;
  background-color: ${theme.commonSoft};
  border: 1px solid ${theme.commonHighlight};
  color: ${theme.secondaryTextColor};
  margin-top: 0.2em;
  position: relative;
  text-align: center;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const PanelTitle = styled.h2`
  padding: 0.5em 0;
  margin: 0;
  font-size: 1.4em;
  font-weight: normal;
`;

const PanelHead = styled.div`
  height: 2.6em;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`;

const PanelHeadCorner = styled.div`
  flex: 1 1 20%;
  border-bottom: 1px solid ${theme.commonSoftTint};
`;

const PanelHeadHeader = styled.div`
  box-sizing: border-box;
  background-color: ${theme.primaryBackgroundColor};
  flex: 1 1 60%;
  z-index: 1;
  height: 5.2rem;
  padding-top: 0.5em;
  border-radius: 50%;
  border: 1px solid ${theme.commonSoftTint};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const PanelContent = styled.div`
  box-sizing: border-box;
  background-color: ${theme.primaryBackgroundColor};
  border-radius: 0 0 0.7em 0.7em;
  padding: 0.3em;
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
`;

const ContentTitle = styled.h2`
  padding: 0.5em 0;
  margin: 0;
  font-size: 1.4em;
  font-weight: normal;
`;

const Answers = styled.div`
  width: 100%;
  border-top: 1px solid ${theme.lightGrey};
  display: flex;
  flex-direction: row;
`;

const Answer = styled.button<{ variant: 'drunk' | 'sober' }>`
  padding: 1em;
  position: relative;
  cursor: pointer;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  color: inherit;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  transition: background-color 0.1s ease;

  &:active {
    background-color: ${props =>
      props.variant === 'drunk' ? theme.limitedSoft : theme.rareSoft
    };
  }
`;

const AnswerTitle = styled.h2<{ variant: 'drunk' | 'sober' }>`
  padding: 0.5em 0;
  margin: 0;
  font-size: 1.4em;
  font-weight: normal;
  color: ${props =>
    props.variant === 'drunk' ? theme.failureRed : theme.rareHighlight
  };
`;

const LogoIcon = styled.svg`
  height: 3em;
  width: 100%;
`;

const NoMercyIcon = styled(NoMercy)`
  height: 6rem;
  width: 6rem;
  color: ${theme.failureRed};
  fill: currentColor;
`;

const AngelIcon = styled(Angel)`
  height: 6rem;
  width: 6rem;
  color: ${theme.rareHighlight};
  fill: currentColor;
`;

export const CardBack: React.FC<CardBackProps> = ({ onCategorySelected }) => {
  const handleSelection = (category: 'drinking' | 'nonDrinking') => {
    if (onCategorySelected) {
      onCategorySelected(category);
    }
  };

  return (
    <Wrapper>
      <Panel>
        <PanelTitle>Time Pong</PanelTitle>

        {/* Panel head */}
        <PanelHead>
          {/* Left corner */}
          <PanelHeadCorner />

          {/* Center header */}
          <PanelHeadHeader>
            <LogoIcon viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3"/>
              <text x="50" y="60" fontSize="40" textAnchor="middle" fill="currentColor" fontWeight="bold">TP</text>
            </LogoIcon>
          </PanelHeadHeader>

          {/* Right corner */}
          <PanelHeadCorner />
        </PanelHead>

        {/* Panel content */}
        <PanelContent>
          <div>
            <ContentTitle>Getting drunk?</ContentTitle>
            <Answers>
              {/* Yes - Drinking */}
              <Answer
                variant="drunk"
                onClick={() => handleSelection('drinking')}
              >
                <NoMercyIcon />
                <AnswerTitle variant="drunk">Yes</AnswerTitle>
              </Answer>

              {/* No - Non-drinking */}
              <Answer
                variant="sober"
                onClick={() => handleSelection('nonDrinking')}
              >
                <AngelIcon />
                <AnswerTitle variant="sober">No</AnswerTitle>
              </Answer>
            </Answers>
          </div>
        </PanelContent>
      </Panel>
    </Wrapper>
  );
};
