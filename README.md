# 🔐 SecurePay — Modern Payment Gateway UI

A modern, secure, and fully responsive Payment Gateway UI built with **Next.js 15 (App Router)**, **TypeScript**, and **Redux Toolkit**.

This project simulates a complete payment lifecycle including:

- Card validation
- Payment processing
- Retry logic
- Timeout handling
- Persistent transaction history

All without using any third-party payment SDKs.


# ✨ Features

## 💳 Payment Form

- Real-time field validation
- Auto-formatting card numbers
- Card type detection:
  - Visa
  - Mastercard
  - American Express
- Dynamic CVV validation:
  - 3 digits for Visa/Mastercard
  - 4 digits for Amex
- Expiry date validation
- Currency selector (USD / INR)
- Disabled submit until form is valid

---

## 🪪 Live Card Preview

- Real-time updates while typing
- Dynamic card styling per card type
- Premium glassmorphism-inspired UI
- Smooth hover interactions

---

## 🔄 Payment Lifecycle

Simulated payment states:

```text
Idle → Processing → Success / Failed / Timeout
```

Includes:

- Processing loader
- Success state
- Failure state
- Timeout handling
- Retry mechanism

---

## ⚡ Mock Payment Gateway API

Custom API route:

```bash
/api/pay
```

Simulated outcomes:

| Result   | Probability |
|----------|-------------|
| Success  | ~60% |
| Failure  | ~25% |
| Timeout  | ~15% |

Timeout flow:

- API intentionally delays for 8 seconds
- Frontend aborts request after 6 seconds using `AbortController`

---

## 🔁 Retry Logic

- Maximum 3 retry attempts
- Same transaction ID reused across retries
- Attempt counter visible to users
- Retry disabled after limit reached

---

## 🧾 Transaction History

- Persistent using `localStorage`
- View full transaction details
- Color-coded statuses
- Clear all history support

---

## 🛡️ Idempotency

Each transaction uses:

```ts
crypto.randomUUID()
```

The same transaction ID is reused across retries to simulate real-world payment gateway idempotency.

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript | Fully typed codebase |
| Redux Toolkit | Global state management |
| CSS Modules | Scoped component styling |
| Lucide React | Icon library |

---

# 📦 Installation & Setup

## Prerequisites

Make sure you have:

- Node.js >= 18
- npm >= 9

---

## Clone Repository

```bash
git clone https://github.com/Vs-kishu/Payment-Gateway.git
```

---

## Navigate to Project

```bash
cd payment-gateway
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Development Server

```bash
npm run dev
```

---

## Open Application

Visit:

```bash
http://localhost:3000
```

---

# 📁 Project Structure

```bash
payment-gateway/
│
├── app/
│   ├── api/pay/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── CardPreview/
│   ├── PaymentForm/
│   ├── StatusScreen/
│   └── TransactionHistory/
│
├── hooks/
│   └── usePayment.ts
│
├── store/
│   ├── store.ts
│   ├── paymentSlice.ts
│   ├── hooks.ts
│   └── StoreProvider.tsx
│
├── types/
│   └── index.ts
│
├── utils/
│   ├── cardType.ts
│   ├── formatters.ts
│   └── validation.ts
│
└── README.md
```



Frontend timeout:

```text
6 seconds
```

Mock API timeout:

```text
8 seconds
```

---

## LocalStorage Hydration Strategy

Transaction history is:

1. Loaded once on app mount
2. Hydrated into Redux store
3. Persisted automatically after updates

Redux remains the single source of truth.

---

# 🧪 Validation Features

Includes:

- Luhn algorithm validation
- Expiry date checks
- CVV validation
- Required field validation
- Card number formatting

---

# 🔮 Future Improvements

Given more time, the following enhancements could be added:

1. Framer Motion animations
2. Card flip animation
3. Dark/light theme toggle
4. Playwright E2E tests
5. API rate limiting
6. Mobile haptic feedback
7. Skeleton loaders
8. CSV export
9. More currencies
10. Real-time exchange rates

---

# 📝 Assumptions

- No real payment processor integration
- Payment responses are randomized
- Data stored only in browser localStorage
- Timeout behavior intentionally simulated

---

# 📄 License

This project was created as a frontend assignment submission.

---

# 👨‍💻 Author

**Krishna Kant Verma**

Frontend / Full Stack Developer

Built with ❤️ using Next.js & TypeScript
