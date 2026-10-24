import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceSubtle} 25%,
    ${({ theme }) => theme.colors.surface} 50%,
    ${({ theme }) => theme.colors.surfaceSubtle} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.8s infinite ease-in-out;
  border-radius: ${({ $radius, theme }) => $radius || theme.radii.md};
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '20px'};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 16px 0;
`;

const SkeletonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 8px;
`;

const SkeletonStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SkeletonMainGrid = styled.div`
  display: grid;
  grid-template-columns: clamp(300px, 32vw, 420px) 1fr;
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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

export const DashboardSkeleton = () => {
  return (
    <SkeletonContainer
      role="status"
      aria-live="polite"
      aria-busy="true"
      id="dashboard-skeleton-loader"
      data-testid="dashboard-skeleton-loader"
    >
      <VisuallyHidden>Loading FinTrack Pro financial dashboard metrics and ledger...</VisuallyHidden>

      <SkeletonHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <SkeletonBase $width="44px" $height="44px" $radius="10px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SkeletonBase $width="180px" $height="24px" />
            <SkeletonBase $width="260px" $height="14px" />
          </div>
        </div>
        <SkeletonBase $width="48px" $height="48px" $radius="10px" />
      </SkeletonHeader>

      <SkeletonStatsGrid>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SkeletonBase $width="90px" $height="14px" />
              <SkeletonBase $width="38px" $height="38px" $radius="8px" />
            </div>
            <SkeletonBase $width="140px" $height="32px" />
            <SkeletonBase $width="110px" $height="12px" />
          </SkeletonCard>
        ))}
      </SkeletonStatsGrid>

      <SkeletonCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <SkeletonBase $width="200px" $height="20px" />
          <SkeletonBase $width="100px" $height="20px" />
        </div>
        <SkeletonBase $width="100%" $height="14px" $radius="9999px" />
      </SkeletonCard>

      <SkeletonMainGrid>
        <SkeletonColumn>
          <SkeletonCard>
            <SkeletonBase $width="160px" $height="22px" style={{ marginBottom: '12px' }} />
            <SkeletonBase $width="100%" $height="44px" />
            <SkeletonBase $width="100%" $height="44px" />
            <SkeletonBase $width="100%" $height="44px" />
            <SkeletonBase $width="100%" $height="48px" $radius="8px" />
          </SkeletonCard>
          <SkeletonCard>
            <SkeletonBase $width="180px" $height="22px" style={{ marginBottom: '12px' }} />
            <SkeletonBase $width="100%" $height="24px" />
            <SkeletonBase $width="100%" $height="24px" />
          </SkeletonCard>
        </SkeletonColumn>

        <SkeletonColumn>
          <SkeletonCard>
            <SkeletonBase $width="180px" $height="24px" style={{ marginBottom: '16px' }} />
            <SkeletonBase $width="100%" $height="46px" style={{ marginBottom: '16px' }} />
            {[1, 2, 3, 4].map((j) => (
              <SkeletonBase key={j} $width="100%" $height="70px" style={{ marginBottom: '10px' }} />
            ))}
          </SkeletonCard>
        </SkeletonColumn>
      </SkeletonMainGrid>
    </SkeletonContainer>
  );
};

export default DashboardSkeleton;
