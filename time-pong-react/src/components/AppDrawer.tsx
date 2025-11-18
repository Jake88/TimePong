import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '@/theme';

interface AppDrawerProps {
  children: React.ReactNode;
}

const DrawerContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
`;

const DrawerPanel = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 16em;
  background-color: ${theme.primaryBackgroundColor};
  transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease-in-out;
  z-index: 201;
  overflow-y: auto;
  box-shadow: ${props => props.$isOpen ? '2px 0 8px rgba(0, 0, 0, 0.2)' : 'none'};
`;

const DrawerHeader = styled.div`
  background-color: ${theme.limitedHighlight};
  padding: 1em;
  color: white;
`;

const MenuTitle = styled.h2`
  margin: 0;
  font-size: 1.25em;
  font-weight: 600;
`;

const MenuList = styled.nav`
  padding: 1em 0;
`;

const MenuItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 1em 1.5em;
  text-decoration: none;
  color: ${props => props.$isActive ? theme.limitedHighlight : theme.primaryTextColor};
  background-color: ${props => props.$isActive ? theme.limitedSoft : 'transparent'};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.limitedSoft};
  }

  svg {
    width: 1.5em;
    height: 1.5em;
    margin-right: 1em;
    fill: currentColor;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  height: 3.5em;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.primaryBackgroundColor};
  padding: 0 1em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5em;
  height: 2.5em;
  background: none;
  border: none;
  color: ${theme.primaryTextColor};
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.secondaryTextColor};
  }

  svg {
    width: 1.5em;
    height: 1.5em;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.25em;
  font-weight: 600;
  color: ${theme.primaryTextColor};
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const ContentArea = styled.div`
  padding-top: 3.5em;
  height: 100%;
`;

export default function AppDrawer({ children }: AppDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/game':
        return 'Time Pong';
      case '/cards':
        return 'Card List';
      default:
        return 'Drinking Games';
    }
  };

  return (
    <DrawerContainer>
      <Overlay $isOpen={isOpen} onClick={closeDrawer} />

      <DrawerPanel $isOpen={isOpen}>
        <DrawerHeader>
          <MenuTitle>Drinking Games</MenuTitle>
        </DrawerHeader>

        <MenuList>
          <MenuItem
            to="/"
            $isActive={location.pathname === '/'}
            onClick={closeDrawer}
          >
            <svg viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>Home</span>
          </MenuItem>

          <MenuItem
            to="/game"
            $isActive={location.pathname === '/game'}
            onClick={closeDrawer}
          >
            <svg viewBox="0 0 24 24">
              <path d="M11.5,1L2,6V8H21V6M16,10V17H19V10M2,22H21V19H2M10,10V17H13V10M4,10V17H7V10H4Z" />
            </svg>
            <span>Time Pong</span>
          </MenuItem>

          <MenuItem
            to="/cards"
            $isActive={location.pathname === '/cards'}
            onClick={closeDrawer}
          >
            <svg viewBox="0 0 24 24">
              <path d="M6 17h12V5H6v12zm0-14h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm6 10l-2.5-3.01L7.5 13h9l-3-3.99L11 13z" />
            </svg>
            <span>Card List</span>
          </MenuItem>
        </MenuList>
      </DrawerPanel>

      <MainContent>
        <Header>
          <MenuButton onClick={toggleDrawer} aria-label="Open menu">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </MenuButton>

          <HeaderTitle>{getPageTitle()}</HeaderTitle>
        </Header>

        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </DrawerContainer>
  );
}
