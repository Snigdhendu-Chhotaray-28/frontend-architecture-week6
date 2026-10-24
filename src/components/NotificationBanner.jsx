import React from 'react';
import styled, { css } from 'styled-components';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 24px;
  font-size: 0.95rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 1px solid transparent;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'warning':
        return css`
          background: ${theme.colors.warningLight};
          color: ${theme.colors.warning};
          border-color: rgba(180, 83, 9, 0.4);
        `;
      case 'critical':
        return css`
          background: ${theme.colors.expenseLight};
          color: ${theme.colors.expense};
          border-color: rgba(225, 29, 72, 0.4);
        `;
      case 'success':
        return css`
          background: ${theme.colors.incomeLight};
          color: ${theme.colors.income};
          border-color: rgba(4, 120, 87, 0.4);
        `;
      default:
        return css`
          background: ${theme.colors.primaryLight};
          color: ${theme.colors.primary};
          border-color: rgba(67, 56, 202, 0.4);
        `;
    }
  }}
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  color: inherit;
  opacity: 0.85;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 48px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: opacity ${({ theme }) => theme.transitions.fast}, background ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.08);
  }

  &:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
  }
`;

const NotificationBannerComponent = ({
  message,
  variant = 'info',
  onClose,
  id = 'notification-banner',
}) => {
  if (!message) return null;

  const renderIcon = () => {
    switch (variant) {
      case 'warning':
      case 'critical':
        return <AlertCircle size={22} aria-hidden="true" />;
      case 'success':
        return <CheckCircle size={22} aria-hidden="true" />;
      default:
        return <Info size={22} aria-hidden="true" />;
    }
  };

  return (
    <BannerContainer
      id={id}
      $variant={variant}
      role="alert"
      aria-live="polite"
    >
      <ContentWrapper>
        {renderIcon()}
        <span>{message}</span>
      </ContentWrapper>
      {onClose && (
        <CloseButton
          onClick={onClose}
          aria-label="Dismiss notification"
          data-testid="banner-close-btn"
        >
          <X size={20} aria-hidden="true" />
        </CloseButton>
      )}
    </BannerContainer>
  );
};

export const NotificationBanner = React.memo(NotificationBannerComponent);
export default NotificationBanner;
