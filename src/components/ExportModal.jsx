import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { X, Download, FileSpreadsheet, FileJson } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  width: min(520px, 95vw);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from {
      transform: translateY(20px) scale(0.97);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
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

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.5;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ExportOptionCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 16px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.shadowSm};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 2px;
  }
`;

const OptionTitle = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.primary};
`;

const OptionDescription = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ExportModal = ({ isOpen, onClose, transactions = [] }) => {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Background scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fintrack-ledger-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onClose();
  };

  const exportAsCSV = () => {
    const headers = ['ID', 'Title', 'Amount', 'Type', 'Category', 'Date', 'Notes'];
    const rows = transactions.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      t.category,
      t.date,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `fintrack-ledger-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose} role="presentation" data-testid="export-modal-overlay">
      <ModalContent
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        onClick={(e) => e.stopPropagation()}
        data-testid="export-modal"
      >
        <ModalHeader>
          <ModalTitle id="export-modal-title">
            <Download size={22} color="#4338ca" aria-hidden="true" />
            Export Financial Ledger
          </ModalTitle>
          <CloseButton
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close export dialog"
            data-testid="close-export-modal-btn"
          >
            <X size={20} aria-hidden="true" />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <p>
            Choose your preferred data export format. Exported records contain all {transactions.length} transactions
            with timestamps, categorizations, and amounts.
          </p>

          <OptionsGrid>
            <ExportOptionCard onClick={exportAsJSON} data-testid="export-json-btn">
              <OptionTitle>
                <FileJson size={18} aria-hidden="true" />
                JSON Format
              </OptionTitle>
              <OptionDescription>Full structured ledger dataset for programmatic ingestion & backup.</OptionDescription>
            </ExportOptionCard>

            <ExportOptionCard onClick={exportAsCSV} data-testid="export-csv-btn">
              <OptionTitle>
                <FileSpreadsheet size={18} aria-hidden="true" />
                CSV Spreadsheet
              </OptionTitle>
              <OptionDescription>Tabular data compatible with Excel, Google Sheets, & Numbers.</OptionDescription>
            </ExportOptionCard>
          </OptionsGrid>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ExportModal;
