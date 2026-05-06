import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentState, Transaction } from '@/types';

function loadTransactionsFromStorage(): Transaction[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('payment_transactions');
    if (stored) return JSON.parse(stored) as Transaction[];
  } catch {
  }
  return [];
}

function saveTransactionsToStorage(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('payment_transactions', JSON.stringify(transactions));
  } catch {
  }
}

const initialState: PaymentState = {
  status: 'idle',
  currentTransactionId: null,
  attemptCount: 0,
  maxAttempts: 3,
  resultMessage: '',
  transactions: [],
  selectedTransactionId: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    hydrateTransactions(state) {
      state.transactions = loadTransactionsFromStorage();
    },

    startNewPayment(state, action: PayloadAction<{ transactionId: string }>) {
      state.status = 'processing';
      state.currentTransactionId = action.payload.transactionId;
      state.attemptCount = 1;
      state.resultMessage = '';
    },

    startRetry(state) {
      state.status = 'processing';
      state.attemptCount += 1;
      state.resultMessage = '';
    },

    paymentSuccess(state, action: PayloadAction<{ message: string }>) {
      state.status = 'success';
      state.resultMessage = action.payload.message;
    },

    paymentFailed(state, action: PayloadAction<{ message: string }>) {
      state.status = 'failed';
      state.resultMessage = action.payload.message;
    },

    paymentTimeout(state) {
      state.status = 'timeout';
      state.resultMessage = 'Payment request timed out. Please try again.';
    },

    resetPayment(state) {
      state.status = 'idle';
      state.currentTransactionId = null;
      state.attemptCount = 0;
      state.resultMessage = '';
    },

    upsertTransaction(state, action: PayloadAction<Transaction>) {
      const idx = state.transactions.findIndex((t) => t.id === action.payload.id);
      if (idx >= 0) {
        state.transactions[idx] = action.payload;
      } else {
        state.transactions.unshift(action.payload);
      }
      saveTransactionsToStorage(state.transactions);
    },

    selectTransaction(state, action: PayloadAction<string | null>) {
      state.selectedTransactionId = action.payload;
    },

    clearHistory(state) {
      state.transactions = [];
      saveTransactionsToStorage([]);
    },
  },
});

export const {
  hydrateTransactions,
  startNewPayment,
  startRetry,
  paymentSuccess,
  paymentFailed,
  paymentTimeout,
  resetPayment,
  upsertTransaction,
  selectTransaction,
  clearHistory,
} = paymentSlice.actions;

export default paymentSlice.reducer;
