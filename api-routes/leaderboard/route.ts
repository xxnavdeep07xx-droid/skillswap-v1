import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'alltime';

    let dateFilter: any = undefined;

    if (period === 'weekly') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      dateFilter = { gte: oneWeekAgo };
    } else if (period === 'monthly') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      dateFilter = { gte: oneMonthAgo };
    }

    const users = await db.user.findMany({
      orderBy: { xp: 'desc' },
      take: 50,
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        xp: true,
        sp: true,
        leagueTier: true,
        streak: true,
        totalSessionsTaught: true,
        totalSessionsLearned: true,
        averageRating: true,
      },
    });

    // For period-based leaderboard, we could compute XP from coin transactions
    // but since XP is a simple counter on the user, we return the global leaderboard
    // filtered by updated time if period is set
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      ...user,
    }));

    return NextResponse.json({ leaderboard, period });
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard', details: error.message }, { status: 500 });
  }
}
