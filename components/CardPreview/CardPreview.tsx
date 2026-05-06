'use client';

import { CardType } from '@/types';

interface CardPreviewProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cardType: CardType;
}

function formatDisplayNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const padded = cleaned.padEnd(16, '•');
  return `${padded.slice(0, 4)} ${padded.slice(4, 8)} ${padded.slice(8, 12)} ${padded.slice(12, 16)}`;
}

function getBrandLabel(cardType: CardType): string {
  switch (cardType) {
    case 'visa': return 'VISA';
    case 'mastercard': return 'Mastercard';
    case 'amex': return 'AMEX';
    default: return '';
  }
}

function getCardGradient(cardType: CardType): string {
  switch (cardType) {
    case 'visa': return 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]';
    case 'mastercard': return 'bg-gradient-to-br from-[#1a0a2e] via-[#2d1654] to-[#4a1942]';
    case 'amex': return 'bg-gradient-to-br from-[#0a2e1a] via-[#134e3a] to-[#1a5c4a]';
    default: return 'bg-gradient-to-br from-[#1a1a2e] via-[#2a2a3e] to-[#1e1e32]';
  }
}

function getBrandColor(cardType: CardType): string {
  switch (cardType) {
    case 'visa': return 'text-white italic text-[22px]';
    case 'mastercard': return 'text-orange-400';
    case 'amex': return 'text-blue-400';
    default: return '';
  }
}

export default function CardPreview({ cardNumber, cardholderName, expiryDate, cardType }: CardPreviewProps) {
  const displayNumber = formatDisplayNumber(cardNumber);
  const displayName = cardholderName.trim() || 'YOUR NAME';
  const displayExpiry = expiryDate || 'MM/YY';

  return (
    <div className="w-full max-w-[420px] mx-auto" style={{ perspective: '1000px' }} aria-hidden="true">
      <div
        className={`relative w-full rounded-2xl p-7 flex flex-col justify-between text-white font-mono overflow-hidden transition-all duration-400 ease-out hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.35),0_0_60px_rgba(99,102,241,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.3),0_0_40px_rgba(99,102,241,0.15)] ${getCardGradient(cardType)}`}
        style={{ aspectRatio: '1.586 / 1', transformStyle: 'preserve-3d' }}
      >
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
        <div className="flex justify-between items-start">
          <div className="w-12 h-9 rounded-md relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #d4af37 100%)' }}>
            <div className="absolute top-1/2 left-[10%] w-[80%] h-px bg-black/20" />
            <div className="absolute top-1/4 left-1/2 w-px h-1/2 bg-black/20" />
          </div>
          <span className={`text-sm font-bold tracking-widest uppercase font-sans ${getBrandColor(cardType)}`}>
            {getBrandLabel(cardType)}
          </span>
        </div>
        <div className="text-[22px] tracking-[3px] text-center my-1 drop-shadow-md max-sm:text-base max-sm:tracking-[2px]">
          {displayNumber}
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[9px] uppercase opacity-60 tracking-wider mb-0.5 font-sans">Card Holder</div>
            <div className="text-sm uppercase tracking-widest max-w-[200px] truncate max-sm:text-[11px] max-sm:max-w-[140px]">{displayName}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase opacity-60 tracking-wider mb-0.5 font-sans">Expires</div>
            <div className="text-base tracking-widest max-sm:text-[13px]">{displayExpiry}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
