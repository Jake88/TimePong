import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '@/theme';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1em;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 28em;
  text-align: center;
`;

const TitleSection = styled.div`
  margin-bottom: 2em;
`;

const Title = styled.h1`
  font-size: 3.5em;
  font-weight: bold;
  color: ${theme.primaryTextColor};
  margin: 0 0 0.5em 0;

  @media (min-width: 768px) {
    font-size: 4em;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25em;
  color: ${theme.secondaryTextColor};
  margin: 0;
`;

const Description = styled.div`
  background-color: ${theme.primaryBackgroundColor};
  border-radius: 0.5em;
  padding: 1.5em;
  text-align: left;
  margin-bottom: 2em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DescriptionText = styled.p`
  color: ${theme.secondaryTextColor};
  margin: 0 0 1em 0;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 2em;
`;

const PrimaryButton = styled.button`
  width: 100%;
  border-radius: 0.5em;
  background-color: ${theme.limitedHighlight};
  padding: 1em 2em;
  font-size: 1.125em;
  font-weight: 600;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  border-radius: 0.5em;
  border: 2px solid ${theme.limitedHighlight};
  background-color: transparent;
  padding: 1em 2em;
  font-size: 1.125em;
  font-weight: 600;
  color: ${theme.limitedHighlight};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.limitedSoft};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Footer = styled.div`
  margin-top: 2em;
  text-align: center;
`;

const FooterText = styled.p`
  font-size: 0.875em;
  color: ${theme.lightGrey};
  margin: 0 0 0.5em 0;
`;

const SmallText = styled.p`
  font-size: 0.75em;
  color: ${theme.lightGrey};
  margin: 0;
`;

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container>
      <ContentWrapper>
        {/* Game title */}
        <TitleSection>
          <Title>TimePong</Title>
          <Subtitle>The Ultimate Drinking Game</Subtitle>
        </TitleSection>

        {/* Game description */}
        <Description>
          <DescriptionText>
            A fast-paced drinking game that combines timing, luck, and hilarious challenges.
          </DescriptionText>
          <DescriptionText>
            Draw cards to reveal actions, challenges, spells, and curses. The timer keeps everyone on their toes!
          </DescriptionText>
        </Description>

        {/* Navigation buttons */}
        <ButtonGroup>
          <PrimaryButton onClick={() => navigate('/game')}>
            Start Game
          </PrimaryButton>

          <SecondaryButton onClick={() => navigate('/cards')}>
            Browse Cards
          </SecondaryButton>
        </ButtonGroup>

        {/* Footer info */}
        <Footer>
          <FooterText>Please drink responsibly</FooterText>
          <SmallText>Must be 21+ to play</SmallText>
        </Footer>
      </ContentWrapper>
    </Container>
  );
}
