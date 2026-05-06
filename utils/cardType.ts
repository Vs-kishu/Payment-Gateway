import { CardType } from '@/types';

export function detectCardType(cardNumber: string): CardType {
  const cleaned = cardNumber.replace(/\s/g, '');

  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';

  return 'unknown';
}

export function getCardNumberLength(cardType: CardType): number {
  return cardType === 'amex' ? 15 : 16;
}

export function getCvvLength(cardType: CardType): number {
  return cardType === 'amex' ? 4 : 3;
}
