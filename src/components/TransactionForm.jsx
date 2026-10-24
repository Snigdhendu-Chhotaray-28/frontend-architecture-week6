import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { PlusCircle, DollarSign, Calendar, Tag, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { validateTransaction } from '../utils/finance';

const FormCard = styled.section`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  backdrop-filter: blur(12px);
`;

const FormTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const TypeToggleGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const TypeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.92rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid transparent;

  ${({ $selected, $type, theme }) => {
    if (!$selected) {
      return css`
        background: ${theme.colors.surfaceSubtle};
        color: ${theme.colors.textSecondary};
        border-color: ${theme.colors.border};
        &:hover {
          background: ${theme.colors.surface};
          color: ${theme.colors.text};
        }
      `;
    }
    if ($type === 'income') {
      return css`
        background: ${theme.colors.income};
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(4, 120, 87, 0.35);
      `;
    }
    return css`
      background: ${theme.colors.expense};
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(225, 29, 72, 0.35);
    `;
  }}

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 2px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconPosition = styled.div`
  position: absolute;
  left: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px 12px 42px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ $hasError, theme }) => ($hasError ? theme.colors.expense : theme.colors.border)};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  transition: border-color ${({ theme }) => theme.transitions.fast}, box-shadow ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) => ($hasError ? theme.colors.expense : theme.colors.primary)};
    box-shadow: 0 0 0 3px ${({ $hasError, theme }) => ($hasError ? 'rgba(225, 29, 72, 0.25)' : theme.colors.primaryLight)};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px 12px 42px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ $hasError, theme }) => ($hasError ? theme.colors.expense : theme.colors.border)};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const ErrorText = styled.span`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.expense};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: #ffffff;
  padding: 14px 20px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 700;
  font-size: 0.98rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(67, 56, 202, 0.35);
  transition: all ${({ theme }) => theme.transitions.normal};
  margin-top: 6px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(67, 56, 202, 0.45);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing || theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CATEGORIES = {
  income: ['Consulting', 'Salary', 'Passive Income', 'Investments', 'Freelance', 'Other Income'],
  expense: ['Software', 'Office', 'Hosting & Cloud', 'Marketing', 'Hardware', 'Travel', 'Food', 'Utilities', 'Other Expense'],
};

const TransactionFormComponent = ({ onAddTransaction }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Software');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      title,
      amount,
      type,
      category,
      date,
      notes,
    };

    const validation = validateTransaction(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const newTransaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        category,
        date,
        notes: notes.trim(),
      };

      if (onAddTransaction) {
        onAddTransaction(newTransaction);
      }

      // Reset form
      setTitle('');
      setAmount('');
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      id="transaction-form-card"
      data-testid="transaction-form-card"
      aria-labelledby="transaction-form-title"
    >
      <FormTitle id="transaction-form-title">
        <PlusCircle size={22} color="#4338ca" aria-hidden="true" />
        Record Transaction
      </FormTitle>

      <Form onSubmit={handleSubmit} noValidate data-testid="transaction-form">
        <FormGroup>
          <Label id="tx-type-label">Transaction Type</Label>
          <TypeToggleGroup role="radiogroup" aria-labelledby="tx-type-label">
            <TypeButton
              type="button"
              role="radio"
              aria-checked={type === 'income'}
              $type="income"
              $selected={type === 'income'}
              onClick={() => handleTypeChange('income')}
              data-testid="type-income-btn"
            >
              <ArrowDownRight size={18} aria-hidden="true" />
              Income
            </TypeButton>
            <TypeButton
              type="button"
              role="radio"
              aria-checked={type === 'expense'}
              $type="expense"
              $selected={type === 'expense'}
              onClick={() => handleTypeChange('expense')}
              data-testid="type-expense-btn"
            >
              <ArrowUpRight size={18} aria-hidden="true" />
              Expense
            </TypeButton>
          </TypeToggleGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tx-title-input">Description / Title *</Label>
          <InputWrapper>
            <IconPosition><Tag size={18} aria-hidden="true" /></IconPosition>
            <Input
              id="tx-title-input"
              type="text"
              placeholder="e.g. GitHub Team Subscription"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              $hasError={Boolean(errors.title)}
              aria-invalid={Boolean(errors.title)}
              aria-required="true"
              aria-describedby={errors.title ? 'title-error-msg' : undefined}
              data-testid="title-input"
            />
          </InputWrapper>
          {errors.title && (
            <ErrorText id="title-error-msg" role="alert" aria-live="polite" data-testid="title-error">
              {errors.title}
            </ErrorText>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tx-amount-input">Amount ($) *</Label>
          <InputWrapper>
            <IconPosition><DollarSign size={18} aria-hidden="true" /></IconPosition>
            <Input
              id="tx-amount-input"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              $hasError={Boolean(errors.amount)}
              aria-invalid={Boolean(errors.amount)}
              aria-required="true"
              aria-describedby={errors.amount ? 'amount-error-msg' : undefined}
              data-testid="amount-input"
            />
          </InputWrapper>
          {errors.amount && (
            <ErrorText id="amount-error-msg" role="alert" aria-live="polite" data-testid="amount-error">
              {errors.amount}
            </ErrorText>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tx-category-select">Category *</Label>
          <InputWrapper>
            <IconPosition><Tag size={18} aria-hidden="true" /></IconPosition>
            <Select
              id="tx-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-required="true"
              data-testid="category-select"
            >
              {CATEGORIES[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tx-date-input">Transaction Date *</Label>
          <InputWrapper>
            <IconPosition><Calendar size={18} aria-hidden="true" /></IconPosition>
            <Input
              id="tx-date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              $hasError={Boolean(errors.date)}
              aria-invalid={Boolean(errors.date)}
              aria-required="true"
              aria-describedby={errors.date ? 'date-error-msg' : undefined}
              data-testid="date-input"
            />
          </InputWrapper>
          {errors.date && (
            <ErrorText id="date-error-msg" role="alert" aria-live="polite" data-testid="date-error">
              {errors.date}
            </ErrorText>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tx-notes-input">Notes (Optional)</Label>
          <InputWrapper>
            <IconPosition><FileText size={18} aria-hidden="true" /></IconPosition>
            <Input
              id="tx-notes-input"
              type="text"
              placeholder="Reference #, invoice link, details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-testid="notes-input"
            />
          </InputWrapper>
        </FormGroup>

        <SubmitButton
          type="submit"
          disabled={isSubmitting}
          data-testid="submit-transaction-btn"
        >
          <PlusCircle size={18} aria-hidden="true" />
          {isSubmitting ? 'Recording...' : `Record ${type === 'income' ? 'Income' : 'Expense'}`}
        </SubmitButton>
      </Form>
    </FormCard>
  );
};

export const TransactionForm = React.memo(TransactionFormComponent);
export default TransactionForm;
