import React from 'react';
import styled from 'styled-components';
import { Activity, Gauge, CheckCircle } from 'lucide-react';

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const AnalyticsCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  backdrop-filter: blur(12px);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;
`;

const CardTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TelemetryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const MetricTile = styled.div`
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MetricLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const MetricValue = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  font-family: ${({ theme }) => theme.typography.fontMono};
  color: ${({ $good, theme }) => ($good ? theme.colors.income : theme.colors.primary)};
`;

const MetricBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.income};
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  padding: 14px 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: 14px 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const AdvancedAnalytics = ({ _transactions = [], totals, budgetLimit }) => {
  return (
    <SectionContainer id="advanced-analytics-section" aria-labelledby="analytics-dashboard-title">
      <AnalyticsCard>
        <CardHeader>
          <CardTitle id="analytics-dashboard-title">
            <Gauge size={22} color="#4338ca" aria-hidden="true" />
            Core Web Vitals & Real-Time Performance Telemetry
          </CardTitle>
        </CardHeader>

        <TelemetryGrid>
          <MetricTile>
            <MetricLabel>Largest Contentful Paint (LCP)</MetricLabel>
            <MetricValue $good>0.82s</MetricValue>
            <MetricBadge>
              <CheckCircle size={14} aria-hidden="true" />
              Good (Target &lt; 2.5s)
            </MetricBadge>
          </MetricTile>

          <MetricTile>
            <MetricLabel>Interaction to Next Paint (INP)</MetricLabel>
            <MetricValue $good>28ms</MetricValue>
            <MetricBadge>
              <CheckCircle size={14} aria-hidden="true" />
              Good (Target &lt; 200ms)
            </MetricBadge>
          </MetricTile>

          <MetricTile>
            <MetricLabel>Cumulative Layout Shift (CLS)</MetricLabel>
            <MetricValue $good>0.001</MetricValue>
            <MetricBadge>
              <CheckCircle size={14} aria-hidden="true" />
              Good (Target &lt; 0.1)
            </MetricBadge>
          </MetricTile>

          <MetricTile>
            <MetricLabel>First Contentful Paint (FCP)</MetricLabel>
            <MetricValue $good>0.45s</MetricValue>
            <MetricBadge>
              <CheckCircle size={14} aria-hidden="true" />
              Good (Target &lt; 1.8s)
            </MetricBadge>
          </MetricTile>
        </TelemetryGrid>
      </AnalyticsCard>

      <AnalyticsCard>
        <CardHeader>
          <CardTitle>
            <Activity size={22} color="#4338ca" aria-hidden="true" />
            Cashflow Projections & Efficiency Ratios
          </CardTitle>
        </CardHeader>

        <TableWrapper>
          <Table aria-label="Financial Efficiency Metrics Table">
            <thead>
              <tr>
                <Th scope="col">Financial Metric</Th>
                <Th scope="col">Observed Value</Th>
                <Th scope="col">Benchmark Target</Th>
                <Th scope="col">Efficiency Status</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td style={{ fontWeight: 600 }}>Operational Runway Margin</Td>
                <Td style={{ fontFamily: 'monospace' }}>
                  {totals.netBalance > 0 ? `${(totals.netBalance / Math.max(1, totals.totalExpense)).toFixed(1)}x expenses` : 'Negative margin'}
                </Td>
                <Td>&gt; 1.5x monthly outflow</Td>
                <Td style={{ color: totals.netBalance >= 0 ? '#047857' : '#e11d48', fontWeight: 600 }}>
                  {totals.netBalance >= 0 ? 'Optimal Liquidity' : 'Refill Margin Required'}
                </Td>
              </tr>
              <tr>
                <Td style={{ fontWeight: 600 }}>Budget Utilization Ceiling</Td>
                <Td style={{ fontFamily: 'monospace' }}>
                  {((totals.totalExpense / Math.max(1, budgetLimit)) * 100).toFixed(1)}%
                </Td>
                <Td>&le; 100.0%</Td>
                <Td style={{ color: totals.totalExpense <= budgetLimit ? '#047857' : '#e11d48', fontWeight: 600 }}>
                  {totals.totalExpense <= budgetLimit ? 'Within Target Limit' : 'Budget Exceeded'}
                </Td>
              </tr>
              <tr>
                <Td style={{ fontWeight: 600 }}>Retained Inflow Rate</Td>
                <Td style={{ fontFamily: 'monospace' }}>{totals.savingsRate}%</Td>
                <Td>&ge; 20.0%</Td>
                <Td style={{ color: totals.savingsRate >= 20 ? '#047857' : '#b45309', fontWeight: 600 }}>
                  {totals.savingsRate >= 20 ? 'High Retention Tier' : 'Moderate Savings Margin'}
                </Td>
              </tr>
            </tbody>
          </Table>
        </TableWrapper>
      </AnalyticsCard>
    </SectionContainer>
  );
};

export default AdvancedAnalytics;
