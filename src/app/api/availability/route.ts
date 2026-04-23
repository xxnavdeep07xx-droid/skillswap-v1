import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get('coachId');

    if (!coachId) {
      return NextResponse.json({ error: 'coachId query parameter is required' }, { status: 400 });
    }

    const slots = await db.availabilitySlot.findMany({
      where: { coachId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return NextResponse.json({ slots });
  } catch (error: any) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coachId, dayOfWeek, startTime, endTime } = body;

    if (coachId === undefined || dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'coachId, dayOfWeek, startTime, and endTime are required' },
        { status: 400 }
      );
    }

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json({ error: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)' }, { status: 400 });
    }

    const slot = await db.availabilitySlot.create({
      data: {
        coachId,
        dayOfWeek,
        startTime,
        endTime,
      },
    });

    return NextResponse.json({ slot }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating availability slot:', error);
    return NextResponse.json({ error: 'Failed to create availability slot', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slotId = searchParams.get('slotId');

    if (!slotId) {
      return NextResponse.json({ error: 'slotId query parameter is required' }, { status: 400 });
    }

    const slot = await db.availabilitySlot.findUnique({ where: { id: slotId } });
    if (!slot) {
      return NextResponse.json({ error: 'Availability slot not found' }, { status: 404 });
    }

    await db.availabilitySlot.delete({ where: { id: slotId } });

    return NextResponse.json({ message: 'Availability slot removed successfully' });
  } catch (error: any) {
    console.error('Error removing availability slot:', error);
    return NextResponse.json({ error: 'Failed to remove availability slot', details: error.message }, { status: 500 });
  }
}
