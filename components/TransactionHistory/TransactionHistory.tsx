'use client';

import { useEffect } from 'react';
import { History, Inbox } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hydrateTransactions, selectTransaction, clearHistory } from '@/store/paymentSlice';
import { Transaction } from '@/types';
import { getCurrencySymbol } from '@/utils/formatters';

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const dotColor: Record<string, string> = {
  success: 'bg-success shadow-[0_0_6px_rgba(16,185,129,0.4)]',
  failed: 'bg-error shadow-[0_0_6px_rgba(239,68,68,0.4)]',
  timeout: 'bg-warning shadow-[0_0_6px_rgba(251,191,36,0.4)]',
};

const statusColor: Record<string, string> = {
  success: 'text-success',
  failed: 'text-error',
  timeout: 'text-warning',
};

export default function TransactionHistory() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s) => s.payment.transactions);
  const selectedId = useAppSelector((s) => s.payment.selectedTransactionId);

  useEffect(() => { dispatch(hydrateTransactions()); }, [dispatch]);

  const selected = selectedId ? transactions.find((t) => t.id === selectedId) : null;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <History size={20} className="text-accent" />
          Transaction History
        </h2>
        {transactions.length > 0 && (
          <button className="px-3.5 py-2 border border-border-custom rounded-lg bg-transparent text-text-secondary text-[13px] cursor-pointer transition-all duration-200 hover:border-error hover:text-error hover:bg-error/[0.08]" onClick={() => dispatch(clearHistory())} id="clear-history-button">
            Clear All
          </button>
        )}
      </div>
      {transactions.length === 0 ? (
        <div className="text-center text-text-muted py-10 text-sm">
          <div className="mb-3 opacity-40"><Inbox size={40} /></div>
          <p>No transactions yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar" role="list">
          {transactions.map((tx: Transaction) => (
            <div key={tx.id}
              className={`flex items-center gap-3.5 p-3.5 px-4 border rounded-xl bg-surface cursor-pointer transition-all duration-200 hover:border-accent hover:bg-surface-elevated hover:translate-x-1 ${selectedId === tx.id ? 'border-accent bg-accent/[0.08]' : 'border-border-custom'}`}
              onClick={() => dispatch(selectTransaction(tx.id))}
              role="listitem" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dispatch(selectTransaction(tx.id)); } }}
              aria-label={`Transaction ${tx.id.slice(0, 8)}, ${getCurrencySymbol(tx.currency)}${tx.amount}, ${tx.status}`}>
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor[tx.status] || ''}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-text-muted font-mono truncate">{tx.id.slice(0, 8)}...</div>
                <div className="text-base font-bold text-text-primary">{getCurrencySymbol(tx.currency)}{tx.amount.toFixed(2)}</div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${statusColor[tx.status] || ''}`}>{tx.status}</div>
                <div className="text-[11px] text-text-muted">{formatTimestamp(tx.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-5 animate-fadeIn" onClick={() => dispatch(selectTransaction(null))}>
          <div className="bg-surface border border-border-custom rounded-2xl p-8 max-w-[420px] w-full animate-slideUp" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-text-primary mb-5">Transaction Details</h3>
            {[
              ['Transaction ID', selected.id],
              ['Cardholder', selected.cardholderName],
              ['Card', `•••• ${selected.lastFourDigits}`],
              ['Amount', `${getCurrencySymbol(selected.currency)}${selected.amount.toFixed(2)}`],
              ['Status', selected.status.toUpperCase()],
              ['Message', selected.message],
              ['Attempts', String(selected.attempts)],
              ['Timestamp', new Date(selected.timestamp).toLocaleString()],
            ].map(([label, value], i, arr) => (
              <div key={label} className={`flex justify-between py-2.5 ${i < arr.length - 1 ? 'border-b border-border-light' : ''}`}>
                <span className="text-[13px] text-text-secondary">{label}</span>
                <span className={`text-sm font-semibold text-right max-w-[200px] break-all ${label === 'Status' ? (statusColor[selected.status] || 'text-text-primary') : 'text-text-primary'}`}>{value}</span>
              </div>
            ))}
            <button className="w-full mt-6 py-3 border-2 border-border-custom rounded-xl bg-transparent text-text-primary text-sm font-semibold cursor-pointer transition-all duration-200 hover:border-accent hover:bg-surface-elevated" onClick={() => dispatch(selectTransaction(null))} id="close-detail-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
