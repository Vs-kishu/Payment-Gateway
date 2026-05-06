export function formatCardNumber(value: string, isAmex: boolean = false): string {
  const cleaned = value.replace(/\D/g, '');

  if (isAmex) {
    const maxLen = Math.min(cleaned.length, 15);
    const trimmed = cleaned.slice(0, maxLen);
    const parts: string[] = [];
    if (trimmed.length > 0) parts.push(trimmed.slice(0, 4));
    if (trimmed.length > 4) parts.push(trimmed.slice(4, 10));
    if (trimmed.length > 10) parts.push(trimmed.slice(10, 15));
    return parts.join(' ');
  }

  const maxLen = Math.min(cleaned.length, 16);
  const trimmed = cleaned.slice(0, maxLen);
  return trimmed.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const trimmed = cleaned.slice(0, 4);

  if (trimmed.length >= 3) {
    return trimmed.slice(0, 2) + '/' + trimmed.slice(2);
  }

  return trimmed;
}

export function formatCvv(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

export function formatAmount(value: string): string {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts[1];
  }
  if (parts.length === 2 && parts[1].length > 2) {
    return parts[0] + '.' + parts[1].slice(0, 2);
  }
  return cleaned;
}

export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return cleaned;
  const last4 = cleaned.slice(-4);
  return '•••• •••• •••• ' + last4;
}

export function getCurrencySymbol(currency: string): string {
  switch (currency) {
    case 'INR': return '₹';
    case 'USD': return '$';
    default: return currency;
  }
}
