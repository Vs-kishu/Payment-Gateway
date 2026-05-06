'use client';

import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  startNewPayment,
  startRetry,
  paymentSuccess,
  paymentFailed,
  paymentTimeout,
  upsertTransaction,
} from '@/store/paymentSlice';
import { PaymentFormFields, PaymentPayload, PaymentResponse, Transaction } from '@/types';

const TIMEOUT_MS = 6000;

export function usePayment() {
  const dispatch = useAppDispatch();
  const { currentTransactionId, attemptCount, maxAttempts, status } = useAppSelector(
    (state) => state.payment
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const canRetry = attemptCount < maxAttempts && (status === 'failed' || status === 'timeout');

  const processPayment = useCallback(
    async (fields: PaymentFormFields, isRetry: boolean = false) => {
      let txId: string;
      if (isRetry && currentTransactionId) {
        txId = currentTransactionId;
        dispatch(startRetry());
      } else {
        txId = crypto.randomUUID();
        dispatch(startNewPayment({ transactionId: txId }));
      }

      const currentAttempt = isRetry ? attemptCount + 1 : 1;

      const payload: PaymentPayload = {
        transactionId: txId,
        cardholderName: fields.cardholderName.trim(),
        cardNumber: fields.cardNumber.replace(/\s/g, ''),
        expiryDate: fields.expiryDate,
        cvv: fields.cvv,
        amount: parseFloat(fields.amount),
        currency: fields.currency,
      };

      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, TIMEOUT_MS);

      try {
        const response = await fetch('/api/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: abortControllerRef.current.signal,
        });

        clearTimeout(timeoutId);

        const data: PaymentResponse = await response.json();

        const transaction: Transaction = {
          id: txId,
          amount: payload.amount,
          currency: fields.currency,
          cardholderName: payload.cardholderName,
          lastFourDigits: payload.cardNumber.slice(-4),
          status: data.success ? 'success' : 'failed',
          message: data.message,
          timestamp: new Date().toISOString(),
          attempts: currentAttempt,
        };

        if (data.success) {
          dispatch(paymentSuccess({ message: data.message }));
        } else {
          dispatch(paymentFailed({ message: data.message }));
        }

        dispatch(upsertTransaction(transaction));
      } catch (error: unknown) {
        clearTimeout(timeoutId);

        if (error instanceof DOMException && error.name === 'AbortError') {
          dispatch(paymentTimeout());
          const transaction: Transaction = {
            id: txId,
            amount: payload.amount,
            currency: fields.currency,
            cardholderName: payload.cardholderName,
            lastFourDigits: payload.cardNumber.slice(-4),
            status: 'timeout',
            message: 'Payment request timed out',
            timestamp: new Date().toISOString(),
            attempts: currentAttempt,
          };
          dispatch(upsertTransaction(transaction));
        } else {
          const message =
            error instanceof Error ? error.message : 'An unexpected error occurred';
          dispatch(paymentFailed({ message: `Network error: ${message}` }));
          const transaction: Transaction = {
            id: txId,
            amount: payload.amount,
            currency: fields.currency,
            cardholderName: payload.cardholderName,
            lastFourDigits: payload.cardNumber.slice(-4),
            status: 'failed',
            message: `Network error: ${message}`,
            timestamp: new Date().toISOString(),
            attempts: currentAttempt,
          };
          dispatch(upsertTransaction(transaction));
        }
      }
    },
    [dispatch, currentTransactionId, attemptCount]
  );

  return { processPayment, canRetry };
}
