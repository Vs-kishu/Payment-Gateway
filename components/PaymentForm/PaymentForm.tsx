'use client';

import { useState, useCallback, FormEvent, ChangeEvent, FocusEvent, useRef, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { PaymentFormFields, TouchedFields, FormErrors, Currency, CardType } from '@/types';
import { detectCardType, getCvvLength } from '@/utils/cardType';
import { formatCardNumber, formatExpiry, formatCvv, formatAmount } from '@/utils/formatters';
import {
  validateCardholderName,
  validateCardNumber,
  validateExpiry,
  validateCvv,
  validateAmount,
  isFormValid,
} from '@/utils/validation';

interface PaymentFormProps {
  onSubmit: (fields: PaymentFormFields) => void;
  disabled: boolean;
  onFieldChange?: (fields: PaymentFormFields, cardType: CardType) => void;
}

const initialFields: PaymentFormFields = {
  cardholderName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  amount: '',
  currency: 'USD',
};

const initialTouched: TouchedFields = {
  cardholderName: false,
  cardNumber: false,
  expiryDate: false,
  cvv: false,
  amount: false,
};

export default function PaymentForm({ onSubmit, disabled, onFieldChange }: PaymentFormProps) {
  const [fields, setFields] = useState<PaymentFormFields>(initialFields);
  const [touched, setTouched] = useState<TouchedFields>(initialTouched);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const cardType = detectCardType(fields.cardNumber);
  const cvvLength = getCvvLength(cardType);

  const computeErrors = useCallback((currentFields: PaymentFormFields): FormErrors => {
    return {
      cardholderName: validateCardholderName(currentFields.cardholderName),
      cardNumber: validateCardNumber(currentFields.cardNumber),
      expiryDate: validateExpiry(currentFields.expiryDate),
      cvv: validateCvv(currentFields.cvv, currentFields.cardNumber),
      amount: validateAmount(currentFields.amount),
    };
  }, []);

  const currentErrors = computeErrors(fields);
  const formIsValid = isFormValid(currentErrors);

  useEffect(() => {
    if (onFieldChange) {
      onFieldChange(fields, cardType);
    }
  }, [fields, cardType, onFieldChange]);

  function computeFieldError(name: string, value: string, currentFields: PaymentFormFields): string | undefined {
    switch (name) {
      case 'cardholderName': return validateCardholderName(value);
      case 'cardNumber': return validateCardNumber(value);
      case 'expiryDate': return validateExpiry(value);
      case 'cvv': return validateCvv(value, currentFields.cardNumber);
      case 'amount': return validateAmount(value);
      default: return undefined;
    }
  }

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formatted = value;

    switch (name) {
      case 'cardNumber':
        formatted = formatCardNumber(value, detectCardType(value) === 'amex');
        break;
      case 'expiryDate':
        formatted = formatExpiry(value);
        break;
      case 'cvv':
        formatted = formatCvv(value, cvvLength);
        break;
      case 'amount':
        formatted = formatAmount(value);
        break;
    }

    const newFields = { ...fields, [name]: formatted };
    setFields(newFields);

    if (touched[name as keyof TouchedFields]) {
      const fieldError = computeFieldError(name, formatted, newFields);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  }, [fields, touched, cvvLength]);

  const handleBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = computeFieldError(name, value, fields);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  }, [fields]);

  const handleCurrencyChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setFields((prev) => ({ ...prev, currency: e.target.value as Currency }));
  }, []);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!formIsValid || disabled || isSubmitting) return;
    setIsSubmitting(true);
    onSubmit(fields);
    setTimeout(() => setIsSubmitting(false), 100);
  }, [fields, formIsValid, disabled, isSubmitting, onSubmit]);

  const showError = (field: keyof TouchedFields): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  const inputBase = `w-full px-4 py-3.5 border-2 rounded-xl bg-surface-elevated text-text-primary text-[15px] font-sans outline-none transition-all duration-250 ease-out placeholder:text-text-muted`;
  const inputFocus = `focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-glow)]`;
  const inputErrorClass = `!border-error !shadow-[0_0_0_4px_rgba(239,68,68,0.1)]`;

  const getInputClasses = (field: keyof TouchedFields) =>
    `${inputBase} ${inputFocus} ${showError(field) ? inputErrorClass : 'border-border-custom'}`;

  const cardBadge = () => {
    if (cardType === 'unknown') return null;
    const badgeStyles: Record<string, string> = {
      visa: 'bg-blue-900/20 text-blue-400',
      mastercard: 'bg-orange-900/20 text-orange-400',
      amex: 'bg-emerald-900/20 text-emerald-400',
    };
    const labels: Record<string, string> = { visa: 'Visa', mastercard: 'MC', amex: 'Amex' };
    return (
      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold tracking-wider px-2 py-0.5 rounded uppercase pointer-events-none ${badgeStyles[cardType]}`}>
        {labels[cardType]}
      </span>
    );
  };

  return (
    <form ref={formRef} className="w-full max-w-[480px]" onSubmit={handleSubmit} noValidate autoComplete="off">
      <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2.5">
        <CreditCard size={24} className="text-accent" />
        Payment Details
      </h2>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cardholderName" className="text-[13px] font-semibold text-text-secondary uppercase tracking-wider">Cardholder Name</label>
          <input id="cardholderName" name="cardholderName" type="text" className={getInputClasses('cardholderName')} placeholder="John Doe" value={fields.cardholderName} onChange={handleChange} onBlur={handleBlur} disabled={disabled} aria-describedby="cardholderName-error" aria-invalid={!!showError('cardholderName')} />
          <span id="cardholderName-error" className="text-xs text-error min-h-[18px] flex items-center gap-1" role="alert">{showError('cardholderName') || ''}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cardNumber" className="text-[13px] font-semibold text-text-secondary uppercase tracking-wider">Card Number</label>
          <div className="relative flex items-center">
            <input id="cardNumber" name="cardNumber" type="text" inputMode="numeric" className={getInputClasses('cardNumber')} placeholder="4242 4242 4242 4242" value={fields.cardNumber} onChange={handleChange} onBlur={handleBlur} disabled={disabled} aria-describedby="cardNumber-error" aria-invalid={!!showError('cardNumber')} />
            {cardBadge()}
          </div>
          <span id="cardNumber-error" className="text-xs text-error min-h-[18px] flex items-center gap-1" role="alert">{showError('cardNumber') || ''}</span>
        </div>

        <div className="flex gap-4 max-sm:flex-col max-sm:gap-5">
          <div className="flex-1 flex flex-col gap-1.5">
            <label htmlFor="expiryDate" className="text-[13px] font-semibold text-text-secondary uppercase tracking-wider">Expiry Date</label>
            <input id="expiryDate" name="expiryDate" type="text" inputMode="numeric" className={getInputClasses('expiryDate')} placeholder="MM/YY" value={fields.expiryDate} onChange={handleChange} onBlur={handleBlur} disabled={disabled} aria-describedby="expiryDate-error" aria-invalid={!!showError('expiryDate')} />
            <span id="expiryDate-error" className="text-xs text-error min-h-[18px] flex items-center gap-1" role="alert">{showError('expiryDate') || ''}</span>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label htmlFor="cvv" className="text-[13px] font-semibold text-text-secondary uppercase tracking-wider">CVV</label>
            <input id="cvv" name="cvv" type="password" inputMode="numeric" className={getInputClasses('cvv')} placeholder={cardType === 'amex' ? '••••' : '•••'} value={fields.cvv} onChange={handleChange} onBlur={handleBlur} disabled={disabled} aria-describedby="cvv-error" aria-invalid={!!showError('cvv')} />
            <span id="cvv-error" className="text-xs text-error min-h-[18px] flex items-center gap-1" role="alert">{showError('cvv') || ''}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="amount" className="text-[13px] font-semibold text-text-secondary uppercase tracking-wider">Amount</label>
          <div className="flex gap-3">
            <div className="flex-1">
              <input id="amount" name="amount" type="text" inputMode="decimal" className={getInputClasses('amount')} placeholder="100.00" value={fields.amount} onChange={handleChange} onBlur={handleBlur} disabled={disabled} aria-describedby="amount-error" aria-invalid={!!showError('amount')} />
            </div>
            <div className="w-[100px]">
              <label htmlFor="currency" className="sr-only">Currency</label>
              <select id="currency" name="currency" className={`w-full px-3 py-3.5 border-2 border-border-custom rounded-xl bg-surface-elevated text-text-primary text-[15px] font-sans outline-none cursor-pointer transition-all duration-250 focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-glow)] appearance-none bg-no-repeat bg-[right_12px_center]`} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")` }} value={fields.currency} onChange={handleCurrencyChange} disabled={disabled}>
                <option value="USD">USD $</option>
                <option value="INR">INR ₹</option>
              </select>
            </div>
          </div>
          <span id="amount-error" className="text-xs text-error min-h-[18px] flex items-center gap-1" role="alert">{showError('amount') || ''}</span>
        </div>

        <button type="submit" className="w-full py-4 border-none rounded-xl text-white text-base font-bold tracking-wide bg-gradient-to-br from-accent to-accent-hover relative overflow-hidden mt-2 transition-all duration-300 hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_8px_25px_rgba(99,102,241,0.35)] active:enabled:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none" disabled={!formIsValid || disabled || isSubmitting} id="pay-button">
          {disabled ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
}
