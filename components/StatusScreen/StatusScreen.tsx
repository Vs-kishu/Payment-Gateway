'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { PaymentStatus } from '@/types';

interface StatusScreenProps {
  status: PaymentStatus;
  message: string;
  attemptCount: number;
  maxAttempts: number;
  canRetry: boolean;
  onRetry: () => void;
  onNewPayment: () => void;
}

export default function StatusScreen({
  status, message, attemptCount, maxAttempts, canRetry, onRetry, onNewPayment,
}: StatusScreenProps) {
  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusRef.current) focusRef.current.focus();
  }, [status]);

  if (status === 'idle') return null;

  const overlayClass = "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-5";
  const cardClass = "bg-surface border border-border-custom rounded-2xl p-12 px-10 max-w-[440px] w-full text-center animate-slideUp shadow-[0_25px_60px_rgba(0,0,0,0.3)] max-sm:p-8 max-sm:px-6";

  if (status === 'processing') {
    return (
      <div className={overlayClass} role="dialog" aria-label="Payment processing" aria-modal="true">
        <div className={cardClass} ref={focusRef} tabIndex={-1}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-accent/15">
            <div className="w-12 h-12 border-4 border-border-custom border-t-accent rounded-full animate-spin-loader" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Processing Payment</h2>
          <p className="text-[15px] text-text-secondary animate-pulse-opacity">Please wait while we process your payment...</p>
          {attemptCount > 1 && (
            <span className="inline-block mt-4 px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border-custom text-[13px] text-text-secondary">
              Attempt {attemptCount} of {maxAttempts}
            </span>
          )}
        </div>
      </div>
    );
  }

  const isSuccess = status === 'success';
  const isTimeout = status === 'timeout';
  const exhausted = attemptCount >= maxAttempts;

  const icon = isSuccess ? <CheckCircle size={40} /> : isTimeout ? <Clock size={40} /> : <XCircle size={40} />;
  const iconBg = isSuccess ? 'bg-success/15 text-success animate-pulse-green' : isTimeout ? 'bg-warning/15 text-warning' : 'bg-error/15 text-error animate-shake';
  const title = isSuccess ? 'Payment Successful!' : isTimeout ? 'Request Timed Out' : 'Payment Failed';
  const finalMsg = exhausted && !isSuccess ? 'Maximum retry attempts reached. Please try again later or contact your bank.' : message;

  return (
    <div className={overlayClass} role="dialog" aria-label={`Payment ${status}`} aria-modal="true">
      <div className={cardClass} ref={focusRef} tabIndex={-1}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${iconBg}`}>{icon}</div>
        <h2 className="text-2xl font-bold text-text-primary mb-2 max-sm:text-xl">{title}</h2>
        <p className="text-[15px] text-text-secondary mb-8 leading-relaxed">{finalMsg}</p>
        {(status === 'failed' || isTimeout) && !exhausted && (
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border-custom text-[13px] text-text-secondary mb-6">
            Attempt {attemptCount} of {maxAttempts}
          </span>
        )}
        {exhausted && !isSuccess && (
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border-custom text-[13px] text-text-secondary mb-6">
            <AlertTriangle size={14} className="mr-1.5" />All {maxAttempts} attempts exhausted
          </span>
        )}
        <div className="flex flex-col gap-3">
          {canRetry && !exhausted && (
            <button className="w-full py-3.5 rounded-xl bg-gradient-to-br from-accent to-accent-hover text-white text-[15px] font-semibold border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.3)]" onClick={onRetry} id="retry-button">
              Retry Payment (Attempt {attemptCount + 1} of {maxAttempts})
            </button>
          )}
          <button className="w-full py-3.5 border-2 border-border-custom rounded-xl bg-transparent text-text-primary text-[15px] font-semibold cursor-pointer transition-all duration-300 hover:border-accent hover:bg-surface-elevated" onClick={onNewPayment} id="new-payment-button">
            {isSuccess ? 'Make Another Payment' : 'Start New Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
