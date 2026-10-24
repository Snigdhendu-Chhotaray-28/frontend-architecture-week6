import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { BudgetProgressBar } from './components/BudgetProgressBar';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { NotificationBanner } from './components/NotificationBanner';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { StorageService } from './services/storage';
import { calculateTotals, calculateBudgetStatus } from './utils/finance';
import { RotateCcw, Download, BarChart2, LayoutDashboard } from 'lucide-react';

import { ExportModal } from './components/ExportModal';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';

const AppWrapper = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px 60px 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 16px 40px 16px;
  }
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: 24px;
  outline: none;
`;

const ViewControlsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const TabsList = styled.div`
  display: inline-flex;
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  padding: 4px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TabButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-weight: 700;
  font-size: 0.9rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ $active, theme }) => ($active ? '#ffffff' : theme.colors.textSecondary)};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  box-shadow: ${({ $active, theme }) => ($active ? theme.colors.shadowSm : 'none')};

  &:hover {
    color: ${({ $active, theme }) => ($active ? '#ffffff' : theme.colors.text)};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ActionButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ExportTriggerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.88rem;
  font-weight: 600;
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceSubtle};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: clamp(300px, 32vw, 420px) 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FooterBar = styled.footer`
  margin-top: 48px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-wrap: wrap;
  gap: 12px;
`;

const ResetDataBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.expense};
    background: ${({ theme }) => theme.colors.surfaceSubtle};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.expense};
    outline-offset: 2px;
  }
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const App = () => {
  const [themeMode, setThemeMode] = useState(() => StorageService.loadTheme());
  const [transactions, setTransactions] = useState(() => StorageService.loadTransactions());
  const [budgetLimit, setBudgetLimit] = useState(() => StorageService.loadBudget());
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Sync state to localStorage on updates
  useEffect(() => {
    StorageService.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    StorageService.saveBudget(budgetLimit);
  }, [budgetLimit]);

  useEffect(() => {
    StorageService.saveTheme(themeMode);
  }, [themeMode]);

  // Derived financial computations memoized
  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const budgetStatus = useMemo(
    () => calculateBudgetStatus(totals.totalExpense, budgetLimit),
    [totals.totalExpense, budgetLimit]
  );

  // Trigger alert banner if budget is exceeded or critical
  useEffect(() => {
    if (budgetStatus.status === 'critical') {
      setNotification({
        message: `Budget Alert: You have exceeded your monthly limit of $${budgetLimit.toLocaleString()} by $${(
          totals.totalExpense - budgetLimit
        ).toFixed(2)}!`,
        variant: 'critical',
      });
    } else if (budgetStatus.status === 'warning') {
      setNotification({
        message: `Caution: You have utilized ${budgetStatus.percentage}% of your monthly budget limit.`,
        variant: 'warning',
      });
    } else {
      setNotification(null);
    }
  }, [budgetStatus.status, budgetStatus.percentage, budgetLimit, totals.totalExpense]);

  // Stabilized callbacks to prevent child component re-renders
  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleAddTransaction = useCallback((newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
    setLiveAnnouncement(`New transaction added: ${newTx.title} for $${newTx.amount}`);
  }, []);

  const handleDeleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setLiveAnnouncement('Transaction deleted successfully from ledger');
  }, []);

  const handleUpdateBudget = useCallback((newLimit) => {
    setBudgetLimit(newLimit);
    setLiveAnnouncement(`Monthly spending target updated to $${newLimit}`);
  }, []);

  const handleResetData = useCallback(() => {
    StorageService.clearAll();
    const fresh = StorageService.loadTransactions();
    setTransactions(fresh);
    setBudgetLimit(2500);
    setLiveAnnouncement('Demo dataset successfully reset to default initial state');
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const currentTheme = useMemo(
    () => (themeMode === 'dark' ? darkTheme : lightTheme),
    [themeMode]
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />

      {/* WCAG 2.1 AA Compliant Skip to Content link */}
      <a href="#main-content" className="skip-to-content">
        Skip to Main Content
      </a>

      {/* Screen Reader Live Region for Dynamic Announcements */}
      <div
        aria-live="polite"
        role="status"
        aria-atomic="true"
        data-testid="a11y-live-announcer"
      >
        <VisuallyHidden>{liveAnnouncement}</VisuallyHidden>
      </div>

      <AppWrapper id="fintrack-app-container">
        <Header currentTheme={themeMode} onToggleTheme={toggleTheme} />

        <MainContent id="main-content" tabIndex="-1">
          {notification && (
            <NotificationBanner
              message={notification.message}
              variant={notification.variant}
              onClose={handleCloseNotification}
            />
          )}

          <ViewControlsBar>
            <TabsList role="tablist" aria-label="Dashboard Views">
              <TabButton
                role="tab"
                id="tab-dashboard"
                aria-selected={activeTab === 'dashboard'}
                aria-controls="panel-dashboard"
                $active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
                data-testid="tab-dashboard-btn"
              >
                <LayoutDashboard size={18} aria-hidden="true" />
                <span>Financial Dashboard</span>
              </TabButton>
              <TabButton
                role="tab"
                id="tab-analytics"
                aria-selected={activeTab === 'analytics'}
                aria-controls="panel-analytics"
                $active={activeTab === 'analytics'}
                onClick={() => setActiveTab('analytics')}
                data-testid="tab-analytics-btn"
              >
                <BarChart2 size={18} aria-hidden="true" />
                <span>Telemetry & Projections</span>
              </TabButton>
            </TabsList>

            <ActionButtonsGroup>
              <ExportTriggerButton
                onClick={() => setIsExportModalOpen(true)}
                aria-label="Export transaction data"
                data-testid="open-export-modal-btn"
              >
                <Download size={16} aria-hidden="true" />
                <span>Export Ledger</span>
              </ExportTriggerButton>
            </ActionButtonsGroup>
          </ViewControlsBar>

          {activeTab === 'dashboard' ? (
            <div
              id="panel-dashboard"
              role="tabpanel"
              aria-labelledby="tab-dashboard"
              data-testid="panel-dashboard"
            >
              {/* Top KPI Metrics Section with valid semantic H2 */}
              <section id="stats-overview-section" aria-labelledby="stats-overview-heading">
                <VisuallyHidden as="h2" id="stats-overview-heading">
                  Financial KPI Metrics Overview
                </VisuallyHidden>
                <StatsGrid id="stats-overview-grid" data-testid="stats-overview-grid">
                  <StatCard
                    title="Total Inflow"
                    amount={totals.totalIncome}
                    variant="income"
                    subtitle="Verified deposits & revenue"
                  />
                  <StatCard
                    title="Total Outflow"
                    amount={totals.totalExpense}
                    variant="expense"
                    subtitle="Operational & personal expenses"
                  />
                  <StatCard
                    title="Net Liquidity"
                    amount={totals.netBalance}
                    variant="balance"
                    subtitle={totals.netBalance >= 0 ? 'Positive financial margin' : 'Cash deficit warning'}
                  />
                  <StatCard
                    title="Savings Rate"
                    amount={totals.savingsRate}
                    variant="savings"
                    isPercentage
                    subtitle="Retained income efficiency"
                  />
                </StatsGrid>
              </section>

              {/* Budget Progress Bar */}
              <BudgetProgressBar
                totalExpense={totals.totalExpense}
                budgetLimit={budgetLimit}
                onUpdateBudget={handleUpdateBudget}
              />

              {/* Two-Column Responsive Layout */}
              <MainGrid>
                <LeftColumn>
                  <TransactionForm onAddTransaction={handleAddTransaction} />
                  <CategoryBreakdown transactions={transactions} />
                </LeftColumn>

                <RightColumn>
                  <TransactionList
                    transactions={transactions}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </RightColumn>
              </MainGrid>
            </div>
          ) : (
            <div
              id="panel-analytics"
              role="tabpanel"
              aria-labelledby="tab-analytics"
              data-testid="panel-analytics"
            >
              <Suspense fallback={<DashboardSkeleton />}>
                <AdvancedAnalytics
                  transactions={transactions}
                  totals={totals}
                  budgetLimit={budgetLimit}
                />
              </Suspense>
            </div>
          )}
        </MainContent>

        <FooterBar role="contentinfo">
          <span>FinTrack Pro v1.0.0 • Architecture & Testing Suite</span>
          <ResetDataBtn onClick={handleResetData} data-testid="reset-data-btn">
            <RotateCcw size={16} aria-hidden="true" />
            Reset Initial Demo Dataset
          </ResetDataBtn>
        </FooterBar>

        {/* Dynamically Loaded Accessible Export Modal */}
        {isExportModalOpen && (
          <Suspense fallback={null}>
            <ExportModal
              isOpen={isExportModalOpen}
              onClose={() => setIsExportModalOpen(false)}
              transactions={transactions}
            />
          </Suspense>
        )}
      </AppWrapper>
    </ThemeProvider>
  );
};

export default App;
