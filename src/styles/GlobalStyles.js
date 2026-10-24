import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
    text-size-adjust: 100%;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    line-height: 1.6;
    min-height: 100vh;
    transition: background-color ${({ theme }) => theme.transitions.normal}, color ${({ theme }) => theme.transitions.normal};
    overflow-x: hidden;
  }

  /* Accessible Skip to Content Link */
  .skip-to-content {
    position: absolute;
    top: -100px;
    left: 20px;
    background: ${({ theme }) => theme.colors.primary};
    color: #ffffff !important;
    padding: 12px 20px;
    border-radius: ${({ theme }) => theme.radii.md};
    font-weight: 700;
    font-size: 0.95rem;
    z-index: 99999;
    text-decoration: none;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    transition: top 0.2s ease-in-out;
    outline: none;

    &:focus, &:focus-visible {
      top: 16px;
      outline: 3px solid #ffffff;
      outline-offset: 2px;
    }
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  /* Custom styled scrollbars */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textMuted};
  }

  /* High contrast accessible focus-visible indicator */
  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 3px;
  }

  /* Reduced Motion Support for Accessibility */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

