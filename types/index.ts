export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'timeout';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

export type Currency = 'INR' | 'USD';

export interface PaymentFormFields {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: string;
  currency: Currency;
}

export interface FormErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  amount?: string;
}

export interface TouchedFields {
  cardholderName: boolean;
  cardNumber: boolean;
  expiryDate: boolean;
  cvv: boolean;
  amount: boolean;
}

export interface PaymentPayload {
  transactionId: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  currency: Currency;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  cardholderName: string;
  lastFourDigits: string;
  status: PaymentStatus;
  message: string;
  timestamp: string;
  attempts: number;
}

export interface PaymentState {
  status: PaymentStatus;
  currentTransactionId: string | null;
  attemptCount: number;
  maxAttempts: number;
  resultMessage: string;
  transactions: Transaction[];
  selectedTransactionId: string | null;
}
