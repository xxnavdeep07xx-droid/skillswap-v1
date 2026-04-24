import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 });
    }

    const where: any = {};

    if (role === 'coach') {
      where.coachId = userId;
    } else if (role === 'learner') {
      where.learnerId = userId;
    } else {
      where.OR = [{ coachId: userId }, { learnerId: userId }];
    }

    if (status) {
      where.status = status as any;
    }

    const sessions = await db.session.findMany({
      where,
      include: {
        coach: {
          select: { id: true, name: true, username: true, image: true },
        },
        learner: {
          select: { id: true, name: true, username: true, image: true },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coachId, learnerId, skillName, scheduledAt, durationMins, spCost } = body;

    if (!coachId || !learnerId || !skillName || !scheduledAt || !spCost) {
      return NextResponse.json(
        { error: 'coachId, learnerId, skillName, scheduledAt, and spCost are required' },
        { status: 400 }
      );
    }

    if (coachId === learnerId) {
      return NextResponse.json({ error: 'Coach and learner cannot be the same user' }, { status: 400 });
    }

    // Verify both users exist
    const [coach, learner] = await Promise.all([
      db.user.findUnique({ where: { id: coachId } }),
      db.user.findUnique({ where: { id: learnerId } }),
    ]);

    if (!coach) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }
    if (!learner) {
      return NextResponse.json({ error: 'Learner not found' }, { status: 404 });
    }

    // Check learner has enough SP
    if (learner.sp < spCost) {
      return NextResponse.json({ error: 'Insufficient SP balance' }, { status: 400 });
    }

    // Create session and update SP in a transaction
    const session = await db.$transaction(async (tx) => {
      const newSession = await tx.session.create({
        data: {
          coachId,
          learnerId,
          skillName,
          scheduledAt: new Date(scheduledAt),
          durationMins: durationMins || 60,
          spCost,
        },
        include: {
          coach: { select: { id: true, name: true, username: true, image: true } },
          learner: { select: { id: true, name: true, username: true, image: true } },
        },
      });

      return newSession;
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session', details: error.message }, { status: 500 });
  }
}
