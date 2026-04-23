import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reporterId, reportedUserId, reason, description } = body;

    if (!reporterId || !reportedUserId || !reason) {
      return NextResponse.json(
        { error: 'reporterId, reportedUserId, and reason are required' },
        { status: 400 }
      );
    }

    if (reporterId === reportedUserId) {
      return NextResponse.json({ error: 'Cannot report yourself' }, { status: 400 });
    }

    // Verify both users exist
    const [reporter, reportedUser] = await Promise.all([
      db.user.findUnique({ where: { id: reporterId } }),
      db.user.findUnique({ where: { id: reportedUserId } }),
    ]);

    if (!reporter) {
      return NextResponse.json({ error: 'Reporter not found' }, { status: 404 });
    }
    if (!reportedUser) {
      return NextResponse.json({ error: 'Reported user not found' }, { status: 404 });
    }

    const report = await db.report.create({
      data: {
        reporterId,
        reportedUserId,
        reason,
        description: description || null,
      },
      include: {
        reporter: {
          select: { id: true, name: true, username: true },
        },
        reportedUser: {
          select: { id: true, name: true, username: true },
        },
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error: any) {
    console.error('Error filing report:', error);
    return NextResponse.json({ error: 'Failed to file report', details: error.message }, { status: 500 });
  }
}
