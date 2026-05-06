import type { Metadata } from 'next';
import StoreProvider from '@/store/StoreProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'SecurePay — Payment Gateway',
  description:
    'A modern, secure payment gateway UI built with Next.js, TypeScript, and Redux Toolkit. Process payments with confidence.',
  keywords: ['payment gateway', 'secure payments', 'credit card', 'Next.js'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
