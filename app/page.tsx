'use client';

import { useCallback, useState, useRef } from 'react';
import { Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetPayment } from '@/store/paymentSlice';
import { usePayment } from '@/hooks/usePayment';
import { PaymentFormFields, CardType } from '@/types';
import CardPreview from '@/components/CardPreview/CardPreview';
import PaymentForm from '@/components/PaymentForm/PaymentForm';
import StatusScreen from '@/components/StatusScreen/StatusScreen';
import TransactionHistory from '@/components/TransactionHistory/TransactionHistory';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { status, attemptCount, maxAttempts, resultMessage } = useAppSelector((s) => s.payment);
  const { processPayment, canRetry } = usePayment();

  const [previewData, setPreviewData] = useState({
    cardNumber: '', cardholderName: '', expiryDate: '', cardType: 'unknown' as CardType,
  });
  const lastFieldsRef = useRef<PaymentFormFields | null>(null);

  const handleFieldChange = useCallback((fields: PaymentFormFields, cardType: CardType) => {
    setPreviewData({ cardNumber: fields.cardNumber, cardholderName: fields.cardholderName, expiryDate: fields.expiryDate, cardType });
  }, []);

  const handleSubmit = useCallback(async (fields: PaymentFormFields) => {
    lastFieldsRef.current = fields;
    await processPayment(fields, false);
  }, [processPayment]);

  const handleRetry = useCallback(async () => {
    if (lastFieldsRef.current) await processPayment(lastFieldsRef.current, true);
  }, [processPayment]);

  const handleNewPayment = useCallback(() => {
    dispatch(resetPayment());
    lastFieldsRef.current = null;
    setPreviewData({ cardNumber: '', cardholderName: '', expiryDate: '', cardType: 'unknown' });
  }, [dispatch]);

  return (
    <div className="relative z-[1] min-h-screen flex flex-col">
      <header className="px-10 py-6 flex items-center gap-3 border-b border-border-light max-sm:px-5 max-sm:py-4">
        <Shield size={24} className="text-accent" />
        <span className="text-[22px] font-extrabold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent tracking-tight">SecurePay</span>
        <span className="text-[13px] text-text-muted font-medium">Payment Gateway</span>
      </header>
      <main className="flex-1 p-10 grid grid-cols-2 gap-15 max-w-[1280px] w-full mx-auto max-[900px]:grid-cols-1 max-[900px]:gap-8 max-[900px]:p-6 max-sm:p-4 max-sm:gap-6">
        <div className="flex flex-col gap-10 items-center pt-5 max-[900px]:pt-0">
          <CardPreview cardNumber={previewData.cardNumber} cardholderName={previewData.cardholderName} expiryDate={previewData.expiryDate} cardType={previewData.cardType} />
          <PaymentForm onSubmit={handleSubmit} disabled={status === 'processing'} onFieldChange={handleFieldChange} />
        </div>
        <div className="pt-5 max-[900px]:pt-0">
          <TransactionHistory />
        </div>
      </main>
      <StatusScreen status={status} message={resultMessage} attemptCount={attemptCount} maxAttempts={maxAttempts} canRetry={canRetry} onRetry={handleRetry} onNewPayment={handleNewPayment} />
    </div>
  );
}
