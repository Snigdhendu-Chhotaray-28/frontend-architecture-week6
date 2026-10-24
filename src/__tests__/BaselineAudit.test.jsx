import React, { Profiler } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import axe from 'axe-core';
import App from '../App';

describe('Baseline Diagnostic & Accessibility Audit', () => {
  it('Axe Accessibility Scan on full App', async () => {
    const { container } = render(<App />);
    const results = await axe.run(container, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
      },
    });

    console.info('\n===== AXE BASELINE VIOLATIONS SUMMARY =====');
    console.info(`Total Violations Found: ${results.violations.length}`);
    results.violations.forEach((v, idx) => {
      console.info(`\n[${idx + 1}] ID: ${v.id} | Impact: ${v.impact}`);
      console.info(`    Description: ${v.description}`);
      console.info(`    Help: ${v.help} (${v.helpUrl})`);
      console.info(`    Nodes Affected (${v.nodes.length}):`);
      v.nodes.slice(0, 3).forEach((n) => {
        console.info(`      - Target: ${n.target.join(' ')}`);
        console.info(`        HTML: ${n.html.substring(0, 100)}...`);
        console.info(`        Failure: ${n.failureSummary}`);
      });
    });

    expect(results).toBeDefined();
    expect(results.violations.length).toBe(0);
  });

  it('React Profiler Render Count & Re-render Cascade Analysis', () => {
    const renderLogs = [];
    const onRenderCallback = (
      id,
      phase,
      actualDuration,
      baseDuration,
      _startTime,
      _commitTime
    ) => {
      renderLogs.push({ id, phase, actualDuration, baseDuration });
    };

    render(
      <Profiler id="AppRoot" onRender={onRenderCallback}>
        <App />
      </Profiler>
    );

    console.info('\n===== REACT PROFILER INITIAL MOUNT =====');
    console.info(`Initial Mount Phase: ${renderLogs[0]?.phase}`);
    console.info(`Actual Duration: ${renderLogs[0]?.actualDuration.toFixed(2)}ms`);
    console.info(`Base Duration: ${renderLogs[0]?.baseDuration.toFixed(2)}ms`);

    // Perform an interaction that triggers re-renders (e.g. typing in search)
    const searchInput = screen.getByTestId('search-input');
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'Software' } });
    });

    console.info(`Re-renders after search input change: ${renderLogs.length - 1}`);
    const latestRender = renderLogs[renderLogs.length - 1];
    console.info(`Search Re-render duration: ${latestRender?.actualDuration.toFixed(2)}ms`);

    // Add transaction interaction
    const titleInput = screen.getByTestId('title-input');
    const amountInput = screen.getByTestId('amount-input');
    const submitBtn = screen.getByTestId('submit-transaction-btn');

    act(() => {
      fireEvent.change(titleInput, { target: { value: 'AWS Hosting Bill' } });
      fireEvent.change(amountInput, { target: { value: '180.50' } });
      fireEvent.click(submitBtn);
    });

    console.info(`Total Renders across entire interaction cycle: ${renderLogs.length}`);
    expect(renderLogs.length).toBeGreaterThan(0);
  });
});
