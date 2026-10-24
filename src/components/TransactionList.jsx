import React, { useState, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { Search, Filter, Inbox, X } from 'lucide-react';
import { TransactionItem } from './TransactionItem';
import { filterAndSortTransactions } from '../utils/finance';
import { List } from 'react-window';

const Container = styled.section`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  backdrop-filter: blur(12px);
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CountBadge = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
`;

const FilterControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 48px 12px 42px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const ClearSearchBtn = styled.button`
  position: absolute;
  right: 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 48px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 2px;
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const TypeFilters = styled.div`
  display: inline-flex;
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  padding: 4px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  gap: 4px;
`;

const TypeFilterBtn = styled.button`
  padding: 10px 16px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.88rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $active, theme }) =>
    $active
      ? css`
          background: ${theme.colors.primary};
          color: #ffffff;
          box-shadow: ${theme.colors.shadowSm};
        `
      : css`
          color: ${theme.colors.textSecondary};
          &:hover {
            color: ${theme.colors.text};
          }
        `}

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 2px;
  }
`;

const DropdownsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 10px 14px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const EmptyIconBox = styled.div`
  margin-bottom: 12px;
  opacity: 0.6;
`;

const EmptyTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 6px;
`;

// Virtual Row Component for very large lists
const VirtualRow = ({ index, style, data }) => {
  const { items, onDelete } = data;
  const tx = items[index];
  return (
    <div style={style}>
      <TransactionItem key={tx.id} transaction={tx} onDelete={onDelete} />
    </div>
  );
};

const TransactionListComponent = ({ transactions = [], onDeleteTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Derive unique categories from existing transactions
  const uniqueCategories = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let sortField = 'date';
    let sortOrder = 'desc';

    if (sortBy === 'date-asc') {
      sortField = 'date';
      sortOrder = 'asc';
    } else if (sortBy === 'amount-desc') {
      sortField = 'amount';
      sortOrder = 'desc';
    } else if (sortBy === 'amount-asc') {
      sortField = 'amount';
      sortOrder = 'asc';
    } else if (sortBy === 'title-asc') {
      sortField = 'title';
      sortOrder = 'asc';
    }

    return filterAndSortTransactions(transactions, {
      type: typeFilter,
      category: categoryFilter,
      searchTerm,
      sortBy: sortField,
      sortOrder,
    });
  }, [transactions, typeFilter, categoryFilter, searchTerm, sortBy]);

  // Use virtualized scrolling when list has more than 50 items and window is available
  const useVirtualList = filteredTransactions.length > 50;

  return (
    <Container
      id="transaction-list-section"
      data-testid="transaction-list-card"
      aria-labelledby="ledger-title"
    >
      <HeaderRow>
        <Title id="ledger-title">
          <Filter size={20} color="#4338ca" aria-hidden="true" />
          <span>Ledger & History</span>
          <CountBadge data-testid="tx-count-badge" aria-label={`${filteredTransactions.length} of ${transactions.length} transactions displayed`}>
            {filteredTransactions.length} of {transactions.length}
          </CountBadge>
        </Title>
      </HeaderRow>

      <FilterControls>
        <SearchWrapper>
          <SearchIcon>
            <Search size={18} aria-hidden="true" />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by description, category, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search transactions"
            data-testid="search-input"
          />
          {searchTerm && (
            <ClearSearchBtn
              onClick={() => setSearchTerm('')}
              aria-label="Clear search query"
              data-testid="clear-search-btn"
            >
              <X size={18} aria-hidden="true" />
            </ClearSearchBtn>
          )}
        </SearchWrapper>

        <FilterRow>
          <TypeFilters role="group" aria-label="Filter transactions by type">
            <TypeFilterBtn
              type="button"
              $active={typeFilter === 'all'}
              onClick={() => setTypeFilter('all')}
              data-testid="filter-type-all"
            >
              All
            </TypeFilterBtn>
            <TypeFilterBtn
              type="button"
              $active={typeFilter === 'income'}
              onClick={() => setTypeFilter('income')}
              data-testid="filter-type-income"
            >
              Income
            </TypeFilterBtn>
            <TypeFilterBtn
              type="button"
              $active={typeFilter === 'expense'}
              onClick={() => setTypeFilter('expense')}
              data-testid="filter-type-expense"
            >
              Expense
            </TypeFilterBtn>
          </TypeFilters>

          <DropdownsGroup>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
              data-testid="filter-category-select"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort transactions"
              data-testid="sort-select"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
              <option value="title-asc">Title: A to Z</option>
            </Select>
          </DropdownsGroup>
        </FilterRow>
      </FilterControls>

      <ListWrapper data-testid="transactions-wrapper" role="feed" aria-busy="false" aria-label="Transaction ledger entries">
        {filteredTransactions.length === 0 ? (
          <EmptyState data-testid="empty-transactions-state">
            <EmptyIconBox>
              <Inbox size={42} aria-hidden="true" />
            </EmptyIconBox>
            <EmptyTitle>No Transactions Found</EmptyTitle>
            <p>
              {transactions.length === 0
                ? 'Your transaction ledger is empty. Start by logging your first transaction!'
                : 'No transactions match the selected filter or search criteria.'}
            </p>
          </EmptyState>
        ) : useVirtualList ? (
          <List
            height={500}
            itemCount={filteredTransactions.length}
            itemSize={82}
            width="100%"
            itemData={{ items: filteredTransactions, onDelete: onDeleteTransaction }}
          >
            {VirtualRow}
          </List>
        ) : (
          filteredTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onDelete={onDeleteTransaction}
            />
          ))
        )}
      </ListWrapper>
    </Container>
  );
};

export const TransactionList = React.memo(TransactionListComponent);
export default TransactionList;
