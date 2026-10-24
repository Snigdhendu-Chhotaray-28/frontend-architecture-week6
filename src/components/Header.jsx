import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Moon, Sun, ShieldCheck, Wallet, Menu, X, BarChart3, ListFilter, Sliders } from 'lucide-react';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  margin-bottom: 28px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  gap: 16px;
  position: relative;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const LogoIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(67, 56, 202, 0.35);
  flex-shrink: 0;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const AppTitle = styled.h1`
  font-size: clamp(1.25rem, 2.5vw, 1.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.text}, ${({ theme }) => theme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AppSubtitle = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  min-height: 48px;
  min-width: 48px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceSubtle};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QualityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border: 1px solid rgba(67, 56, 202, 0.2);

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    display: none;
  }
`;

const ThemeButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 48px;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceSubtle};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.shadowMd};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 2px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 48px;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.shadowSm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: inline-flex;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceSubtle};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 2px;
  }
`;

const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  transition: opacity 0.25s ease;
`;

const DrawerContent = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(320px, 85vw);
  background: ${({ theme }) => theme.colors.surface};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: -6px 0 24px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const DrawerTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseDrawerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceSubtle};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 2px;
  }
`;

const DrawerLinksList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DrawerLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const HeaderComponent = ({ currentTheme, onToggleTheme }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const triggerButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const drawerRef = useRef(null);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    triggerButtonRef.current?.focus();
  }, []);

  // Lock background scrolling when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
      // Automatically focus close button in drawer
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Keyboard navigation: Escape key close & focus trap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isDrawerOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawer();
        return;
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const focusable = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  return (
    <HeaderContainer id="main-header" role="banner">
      <LogoSection>
        <LogoIconBox aria-hidden="true">
          <Wallet size={24} />
        </LogoIconBox>
        <TitleGroup>
          <AppTitle>FinTrack Pro</AppTitle>
          <AppSubtitle>Enterprise Finance Tracker & Quality Testbed</AppSubtitle>
        </TitleGroup>
      </LogoSection>

      <DesktopNav aria-label="Primary Navigation">
        <NavLink href="#stats-overview-grid">
          <BarChart3 size={16} aria-hidden="true" />
          <span>Overview</span>
        </NavLink>
        <NavLink href="#budget-progress-section">
          <Sliders size={16} aria-hidden="true" />
          <span>Budget</span>
        </NavLink>
        <NavLink href="#transaction-list-section">
          <ListFilter size={16} aria-hidden="true" />
          <span>Ledger</span>
        </NavLink>
      </DesktopNav>

      <ActionsGroup>
        <QualityBadge aria-label="Quality assurance test suite status: Active">
          <ShieldCheck size={14} aria-hidden="true" />
          <span>QA Verified (100% RTL)</span>
        </QualityBadge>

        <ThemeButton
          onClick={onToggleTheme}
          aria-label={currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          data-testid="theme-toggle-btn"
        >
          {currentTheme === 'dark' ? (
            <Sun size={20} color="#fbbf24" aria-hidden="true" />
          ) : (
            <Moon size={20} color="#4338ca" aria-hidden="true" />
          )}
        </ThemeButton>

        <MobileMenuButton
          ref={triggerButtonRef}
          onClick={openDrawer}
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-nav-drawer"
          aria-label="Open mobile navigation menu"
          data-testid="mobile-menu-trigger"
        >
          <Menu size={22} aria-hidden="true" />
        </MobileMenuButton>
      </ActionsGroup>

      {/* Accessible Mobile Drawer Navigation */}
      <DrawerOverlay
        $isOpen={isDrawerOpen}
        onClick={closeDrawer}
        aria-hidden="true"
        data-testid="drawer-overlay"
      />

      <DrawerContent
        id="mobile-nav-drawer"
        ref={drawerRef}
        $isOpen={isDrawerOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        data-testid="mobile-nav-drawer"
      >
        <DrawerHeader>
          <DrawerTitle>Navigation Menu</DrawerTitle>
          <CloseDrawerButton
            ref={closeButtonRef}
            onClick={closeDrawer}
            aria-label="Close navigation menu"
            data-testid="close-drawer-btn"
          >
            <X size={20} aria-hidden="true" />
          </CloseDrawerButton>
        </DrawerHeader>

        <DrawerLinksList>
          <DrawerLink href="#stats-overview-grid" onClick={closeDrawer}>
            <BarChart3 size={18} aria-hidden="true" />
            <span>KPI Overview</span>
          </DrawerLink>
          <DrawerLink href="#budget-progress-section" onClick={closeDrawer}>
            <Sliders size={18} aria-hidden="true" />
            <span>Monthly Budget</span>
          </DrawerLink>
          <DrawerLink href="#transaction-form-card" onClick={closeDrawer}>
            <Wallet size={18} aria-hidden="true" />
            <span>Record Transaction</span>
          </DrawerLink>
          <DrawerLink href="#transaction-list-section" onClick={closeDrawer}>
            <ListFilter size={18} aria-hidden="true" />
            <span>Ledger History</span>
          </DrawerLink>
        </DrawerLinksList>
      </DrawerContent>
    </HeaderContainer>
  );
};

// Strategic leaf memoization to prevent cascading re-renders
export const Header = React.memo(HeaderComponent);
export default Header;
