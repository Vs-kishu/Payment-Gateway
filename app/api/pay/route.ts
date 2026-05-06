import { NextRequest, NextResponse } from 'next/server';

interface PayRequestBody {
  transactionId: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  currency: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PayRequestBody;

  if (!body.transactionId || !body.amount || body.amount <= 0) {
    return NextResponse.json(
      { success: false, message: 'Invalid payment request', transactionId: body.transactionId || '' },
      { status: 400 }
    );
  }

  const rand = Math.random();

  if (rand < 0.15) {
    await new Promise((resolve) => setTimeout(resolve, 8000));
    return NextResponse.json({
      success: true,
      message: 'Payment processed (delayed)',
      transactionId: body.transactionId,
    });
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (rand < 0.40) {
    const failureReasons = [
      'Insufficient funds',
      'Card declined by issuer',
      'Transaction limit exceeded',
      'Suspected fraud detected',
    ];
    const reason = failureReasons[Math.floor(Math.random() * failureReasons.length)];

    return NextResponse.json({
      success: false,
      message: reason,
      transactionId: body.transactionId,
    });
  }

  return NextResponse.json({
    success: true,
    message: 'Payment successful',
    transactionId: body.transactionId,
  });
}
