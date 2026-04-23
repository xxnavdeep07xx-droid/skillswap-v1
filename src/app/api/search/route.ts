import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.trim().length === 0) {
      return NextResponse.json({ error: 'Search query parameter q is required' }, { status: 400 });
    }

    const query = q.trim();

    const [users, courses, teachSkills, learnSkills] = await Promise.all([
      // Search users by name, username, bio
      db.user.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { username: { contains: query } },
            { bio: { contains: query } },
          ],
        },
        take: 10,
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
          averageRating: true,
          totalSessionsTaught: true,
          skillsTeach: { take: 3 },
        },
      }),

      // Search courses by title, description, category
      db.course.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { category: { contains: query } },
          ],
        },
        take: 10,
        include: {
          coach: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      }),

      // Search teach skills
      db.skillTeach.findMany({
        where: {
          OR: [
            { skillName: { contains: query } },
            { category: { contains: query } },
          ],
        },
        take: 10,
        distinct: ['skillName'],
        include: {
          user: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      }),

      // Search learn skills
      db.skillLearn.findMany({
        where: {
          OR: [
            { skillName: { contains: query } },
            { category: { contains: query } },
          ],
        },
        take: 10,
        distinct: ['skillName'],
        include: {
          user: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      query,
      results: {
        users,
        courses,
        skills: { teach: teachSkills, learn: learnSkills },
      },
    });
  } catch (error: any) {
    console.error('Error performing search:', error);
    return NextResponse.json({ error: 'Failed to perform search', details: error.message }, { status: 500 });
  }
}
