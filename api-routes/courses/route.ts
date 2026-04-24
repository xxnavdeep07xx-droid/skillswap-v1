import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');
    const search = searchParams.get('search');

    const where: any = { isPublished: true };

    if (category) {
      where.category = category;
    }

    if (filter === 'free') {
      where.isFree = true;
    } else if (filter === 'paid') {
      where.isFree = false;
    } else if (filter === 'trending') {
      where.totalEnrolled = { gte: 1 };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const orderBy: any = filter === 'trending'
      ? { totalEnrolled: 'desc' }
      : { createdAt: 'desc' };

    const courses = await db.course.findMany({
      where,
      orderBy,
      include: {
        coach: {
          select: { id: true, name: true, username: true, image: true },
        },
        lessons: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coachId, title, description, category, isFree, spPrice } = body;

    if (!coachId || !title || !description || !category) {
      return NextResponse.json(
        { error: 'coachId, title, description, and category are required' },
        { status: 400 }
      );
    }

    const coach = await db.user.findUnique({ where: { id: coachId } });
    if (!coach) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    const course = await db.course.create({
      data: {
        coachId,
        title,
        description,
        category,
        isFree: isFree !== false,
        spPrice: isFree ? null : spPrice || 0,
      },
      include: {
        coach: {
          select: { id: true, name: true, username: true, image: true },
        },
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course', details: error.message }, { status: 500 });
  }
}
