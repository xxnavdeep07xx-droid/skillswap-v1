import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'newest';
    const minRating = searchParams.get('minRating');

    // Build the where clause: only users who have skillsTeach (coaches)
    const where: any = {
      skillsTeach: { some: {} },
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { username: { contains: search } },
        { bio: { contains: search } },
      ];
    }

    if (category) {
      where.skillsTeach = { some: { category } };
    }

    if (minRating) {
      where.averageRating = { gte: parseFloat(minRating) };
    }

    // Determine sort order
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'rating') orderBy = { averageRating: 'desc' };
    else if (sort === 'sessions') orderBy = { totalSessionsTaught: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const coaches = await db.user.findMany({
      where,
      orderBy,
      include: {
        skillsTeach: true,
      },
    });

    return NextResponse.json({ coaches });
  } catch (error: any) {
    console.error('Error fetching coaches:', error);
    return NextResponse.json({ error: 'Failed to fetch coaches', details: error.message }, { status: 500 });
  }
}
