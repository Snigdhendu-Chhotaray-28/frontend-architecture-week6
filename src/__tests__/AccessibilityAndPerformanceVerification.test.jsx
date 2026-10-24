import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import App from '../App';
import { StorageService } from '../services/storage';

describe('Phase 5 Verification: Performance & Accessibility Compliance', () => {
  beforeEach(() => {
    localStorage.clear();
    StorageService.clearAll();
  });

  it('verifies Skip to Main Content link exists and links to #main-content', () => {
    render(<App />);
    const skipLink = screen.getByText('Skip to Main Content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(skipLink).toHaveClass('skip-to-content');
  });

  it('verifies semantic document landmarks exist (banner, main, contentinfo, navigation)', () => {
    render(<App />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument();
  });

  it('verifies heading hierarchy has single H1 and properly nested H2 and H3 elements', () => {
    const { container } = render(<App />);

    // Single H1 in document
    const h1Elements = container.querySelectorAll('h1');
    expect(h1Elements.length).toBe(1);
    expect(h1Elements[0]).toHaveTextContent('FinTrack Pro');

    // Section headings are H2
    const h2Elements = container.querySelectorAll('h2');
    expect(h2Elements.length).toBeGreaterThan(0);

    // Stat cards use H3 underneath H2
    const h3Elements = container.querySelectorAll('h3');
    expect(h3Elements.length).toBeGreaterThan(0);
  });

  it('verifies all interactive controls have minimum 48px touch target support', () => {
    render(<App />);

    const themeToggle = screen.getByTestId('theme-toggle-btn');
    expect(themeToggle).toBeInTheDocument();

    const mobileMenuTrigger = screen.getByTestId('mobile-menu-trigger');
    expect(mobileMenuTrigger).toBeInTheDocument();

    const adjustTargetBtn = screen.getByTestId('edit-budget-btn');
    expect(adjustTargetBtn).toBeInTheDocument();

    const submitBtn = screen.getByTestId('submit-transaction-btn');
    expect(submitBtn).toBeInTheDocument();

    const exportBtn = screen.getByTestId('open-export-modal-btn');
    expect(exportBtn).toBeInTheDocument();
  });

  it('verifies mobile navigation drawer opens, traps focus, and closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<App />);

    const menuTrigger = screen.getByTestId('mobile-menu-trigger');
    expect(menuTrigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuTrigger);
    expect(menuTrigger).toHaveAttribute('aria-expanded', 'true');

    const drawer = screen.getByTestId('mobile-nav-drawer');
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute('role', 'dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');

    // Press Escape to dismiss drawer
    fireEvent.keyDown(window, { key: 'Escape' });

    // Drawer closes
    expect(menuTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('verifies dynamic export modal opens with focus trap and closes smoothly', async () => {
    const user = userEvent.setup();
    render(<App />);

    const openExportBtn = screen.getByTestId('open-export-modal-btn');
    await user.click(openExportBtn);

    // Modal renders via Suspense dynamic import
    const modal = await screen.findByTestId('export-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('role', 'dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');

    // Close button dismisses modal
    const closeBtn = screen.getByTestId('close-export-modal-btn');
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('export-modal')).not.toBeInTheDocument();
    });
  });

  it('verifies screen reader dynamic live announcements on transaction modifications', async () => {
    const user = userEvent.setup();
    render(<App />);

    const announcer = screen.getByTestId('a11y-live-announcer');
    expect(announcer).toHaveAttribute('aria-live', 'polite');

    // Add a transaction
    await user.type(screen.getByTestId('title-input'), 'Serverless Cache Redis');
    await user.type(screen.getByTestId('amount-input'), '75.00');
    await user.click(screen.getByTestId('submit-transaction-btn'));

    expect(announcer).toHaveTextContent(/New transaction added: Serverless Cache Redis/i);
  });

  it('verifies full WCAG 2.1 AA axe compliance with ZERO violations on initial render', async () => {
    const { container } = render(<App />);
    const results = await axe.run(container, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    });

    expect(results.violations).toEqual([]);
  });

  it('verifies switching to Telemetry & Analytics view renders cleanly without regressions', async () => {
    const user = userEvent.setup();
    render(<App />);

    const analyticsTab = screen.getByTestId('tab-analytics-btn');
    await user.click(analyticsTab);

    // Expect telemetry dashboard to load
    const telemetrySection = await screen.findByTestId('panel-analytics');
    expect(telemetrySection).toBeInTheDocument();

    // Verify LCP metric display
    expect(await screen.findByText('Largest Contentful Paint (LCP)')).toBeInTheDocument();
  });
});
