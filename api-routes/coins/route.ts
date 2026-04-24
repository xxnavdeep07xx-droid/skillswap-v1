import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 });
    }

    const transactions = await db.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, amount, reason } = body;

    if (!userId || !type || !amount || !reason) {
      return NextResponse.json(
        { error: 'userId, type, amount, and reason are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    if (type !== 'EARNED' && type !== 'SPENT') {
      return NextResponse.json({ error: 'type must be EARNED or SPENT' }, { status: 400 });
    }

    const result = await db.$transaction(async (tx) => {
      // Check user exists and has enough balance for SPENT
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      if (type === 'SPENT' && user.sp < amount) {
        throw new Error('Insufficient SP balance');
      }

      // Update user SP balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          sp: type === 'EARNED' ? { increment: amount } : { decrement: amount },
        },
      });

      // Create transaction record
      const transaction = await tx.coinTransaction.create({
        data: {
          userId,
          type: type as any,
          amount,
          reason,
        },
      });

      return { transaction, user: updatedUser };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    const status = error.message === 'User not found' ? 404
      : error.message === 'Insufficient SP balance' ? 400
      : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to create transaction', details: error.message },
      { status }
    );
  }
}
