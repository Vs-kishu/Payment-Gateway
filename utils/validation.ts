import { FormErrors, PaymentFormFields } from '@/types';
import { detectCardType, getCvvLength, getCardNumberLength } from './cardType';

export function validateCardholderName(name: string): string | undefined {
  if (!name.trim()) return 'Cardholder name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (!/^[a-zA-Z\s.\-']+$/.test(name.trim())) return 'Name contains invalid characters';
  return undefined;
}

function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(digits)) return false;

  let sum = 0;
  let alternate = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

export function validateCardNumber(cardNumber: string): string | undefined {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!cleaned) return 'Card number is required';

  const cardType = detectCardType(cleaned);
  const expectedLength = getCardNumberLength(cardType);

  if (cleaned.length < expectedLength) return `Card number must be ${expectedLength} digits`;
  if (cleaned.length > expectedLength) return `Card number must be ${expectedLength} digits`;
  if (!luhnCheck(cleaned)) return 'Invalid card number';

  return undefined;
}

export function validateExpiry(expiry: string): string | undefined {
  if (!expiry) return 'Expiry date is required';
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Use format MM/YY';

  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10) + 2000;

  if (month < 1 || month > 12) return 'Invalid month';

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }

  return undefined;
}

export function validateCvv(cvv: string, cardNumber: string): string | undefined {
  if (!cvv) return 'CVV is required';

  const cardType = detectCardType(cardNumber);
  const expectedLength = getCvvLength(cardType);

  if (!/^\d+$/.test(cvv)) return 'CVV must contain only digits';
  if (cvv.length !== expectedLength) return `CVV must be ${expectedLength} digits`;

  return undefined;
}

export function validateAmount(amount: string): string | undefined {
  if (!amount) return 'Amount is required';

  const num = parseFloat(amount);
  if (isNaN(num)) return 'Enter a valid amount';
  if (num <= 0) return 'Amount must be greater than 0';
  if (num > 1000000) return 'Amount exceeds maximum limit';

  return undefined;
}

export function validateForm(fields: PaymentFormFields): FormErrors {
  return {
    cardholderName: validateCardholderName(fields.cardholderName),
    cardNumber: validateCardNumber(fields.cardNumber),
    expiryDate: validateExpiry(fields.expiryDate),
    cvv: validateCvv(fields.cvv, fields.cardNumber),
    amount: validateAmount(fields.amount),
  };
}

export function isFormValid(errors: FormErrors): boolean {
  return Object.values(errors).every((e) => e === undefined);
}
