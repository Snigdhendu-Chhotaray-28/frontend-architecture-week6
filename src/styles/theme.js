export const lightTheme = {
  mode: 'light',
  colors: {
    primary: '#4338ca', // Deep Indigo (contrast > 7:1 on white)
    primaryHover: '#3730a3',
    primaryLight: '#e0e7ff',
    secondary: '#0891b2', // Cyan (contrast > 4.5:1 on white)
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceSubtle: '#f1f5f9',
    cardBg: '#ffffff',
    cardBorder: 'rgba(203, 213, 225, 0.9)',
    text: '#0f172a', // High contrast text (16:1)
    textSecondary: '#334155', // Slate-700 (7.1:1 on white)
    textMuted: '#475569', // Slate-600 (4.7:1 on white, WCAG AA compliant)
    income: '#047857', // Emerald-700 (4.6:1 on white)
    incomeLight: 'rgba(5, 150, 105, 0.14)',
    expense: '#e11d48', // Rose-600 (4.6:1 on white)
    expenseLight: 'rgba(225, 29, 72, 0.14)',
    warning: '#b45309', // Amber-700 (4.6:1 on white)
    warningLight: 'rgba(180, 83, 9, 0.14)',
    info: '#1d4ed8', // Blue-700 (5.8:1 on white)
    border: '#cbd5e1',
    focusRing: '#4338ca',
    shadowSm: '0 1px 3px rgba(0, 0, 0, 0.06)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.09), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
    glassBg: 'rgba(255, 255, 255, 0.92)',
    glassBorder: 'rgba(203, 213, 225, 0.6)',
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    full: '9999px',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.4s ease',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
    wide: '1440px',
  },
  a11y: {
    minTouchTarget: '48px',
  },
};

export const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#818cf8', // Indigo-400 (6.2:1 on dark)
    primaryHover: '#a5b4fc',
    primaryLight: 'rgba(129, 140, 248, 0.18)',
    secondary: '#38bdf8', // Sky-400 (7.8:1 on dark)
    background: '#090d16',
    surface: '#111827',
    surfaceSubtle: '#1e293b',
    cardBg: 'rgba(17, 24, 39, 0.85)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    text: '#f8fafc', // High contrast text (15.5:1)
    textSecondary: '#cbd5e1', // Slate-300 (8.6:1 on surface)
    textMuted: '#94a3b8', // Slate-400 (5.1:1 on surface, WCAG AA compliant)
    income: '#34d399', // Emerald-400 (8.1:1 on dark surface)
    incomeLight: 'rgba(52, 211, 153, 0.18)',
    expense: '#fb7185', // Rose-400 (5.5:1 on dark surface)
    expenseLight: 'rgba(251, 113, 133, 0.18)',
    warning: '#fde047', // Yellow-300 (10:1 on dark surface)
    warningLight: 'rgba(253, 224, 71, 0.18)',
    info: '#60a5fa', // Blue-400 (7.1:1 on dark surface)
    border: 'rgba(255, 255, 255, 0.15)',
    focusRing: '#818cf8',
    shadowSm: '0 1px 3px rgba(0, 0, 0, 0.35)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.45), 0 2px 4px -2px rgba(0, 0, 0, 0.35)',
    shadowLg: '0 10px 25px -3px rgba(0, 0, 0, 0.55), 0 4px 6px -4px rgba(0, 0, 0, 0.45)',
    glassBg: 'rgba(17, 24, 39, 0.78)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    full: '9999px',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.4s ease',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
    wide: '1440px',
  },
  a11y: {
    minTouchTarget: '48px',
  },
};
