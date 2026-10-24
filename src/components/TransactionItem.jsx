import React from 'react';
import styled from 'styled-components';
import { Trash2, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/finance';

const ItemContainer = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 12px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateX(4px);
    box-shadow: ${({ theme }) => theme.colors.shadowSm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const TypeIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background: ${({ $type, theme }) =>
    $type === 'income' ? theme.colors.incomeLight : theme.colors.expenseLight};
  color: ${({ $type, theme }) =>
    $type === 'income' ? theme.colors.income : theme.colors.expense};
`;

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.98rem;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-wrap: wrap;
`;

const CategoryPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: space-between;
  }
`;

const AmountText = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-weight: 700;
  font-size: 1.05rem;
  color: ${({ $type, theme }) =>
    $type === 'income' ? theme.colors.income : theme.colors.expense};
`;

const DeleteButton = styled.button`
  color: ${({ theme }) => theme.colors.textMuted};
  min-width: 48px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.expense};
    background: ${({ theme }) => theme.colors.expenseLight};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.expense};
    outline-offset: 2px;
  }
`;

const TransactionItemComponent = ({ transaction, onDelete }) => {
  const { id, title, amount, type, category, date, notes } = transaction;

  return (
    <ItemContainer
      id={`transaction-${id}`}
      data-testid={`transaction-item-${id}`}
      aria-label={`Transaction: ${title}, ${type === 'income' ? 'Income' : 'Expense'} of ${formatCurrency(amount)}`}
    >
      <LeftSection>
        <TypeIconBox $type={type} aria-hidden="true">
          {type === 'income' ? <ArrowDownRight size={22} /> : <ArrowUpRight size={22} />}
        </TypeIconBox>
        <InfoCol>
          <Title>{title}</Title>
          <MetaRow>
            <CategoryPill>
              <Tag size={12} aria-hidden="true" />
              {category}
            </CategoryPill>
            <span>{date}</span>
            {notes && <span>• {notes}</span>}
          </MetaRow>
        </InfoCol>
      </LeftSection>

      <RightSection>
        <AmountText $type={type} data-testid={`transaction-amount-${id}`}>
          {type === 'income' ? '+' : '-'}
          {formatCurrency(amount)}
        </AmountText>
        {onDelete && (
          <DeleteButton
            onClick={() => onDelete(id)}
            aria-label={`Delete transaction: ${title}`}
            data-testid={`delete-transaction-${id}`}
            title={`Delete ${title}`}
          >
            <Trash2 size={18} aria-hidden="true" />
          </DeleteButton>
        )}
      </RightSection>
    </ItemContainer>
  );
};

export const TransactionItem = React.memo(
  TransactionItemComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.transaction.id === nextProps.transaction.id &&
      prevProps.transaction.title === nextProps.transaction.title &&
      prevProps.transaction.amount === nextProps.transaction.amount &&
      prevProps.transaction.type === nextProps.transaction.type &&
      prevProps.transaction.category === nextProps.transaction.category &&
      prevProps.transaction.date === nextProps.transaction.date &&
      prevProps.transaction.notes === nextProps.transaction.notes &&
      prevProps.onDelete === nextProps.onDelete
    );
  }
);

export default TransactionItem;
