import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 });
    }

    if (type === 'teach') {
      const skills = await db.skillTeach.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ skills, type: 'teach' });
    } else if (type === 'learn') {
      const skills = await db.skillLearn.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ skills, type: 'learn' });
    } else {
      // Return both
      const [skillsTeach, skillsLearn] = await Promise.all([
        db.skillTeach.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
        db.skillLearn.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      ]);
      return NextResponse.json({ skillsTeach, skillsLearn });
    }
  } catch (error: any) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Failed to fetch skills', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, skillName, category } = body;

    if (!userId || !type || !skillName) {
      return NextResponse.json(
        { error: 'userId, type, and skillName are required' },
        { status: 400 }
      );
    }

    if (type !== 'teach' && type !== 'learn') {
      return NextResponse.json({ error: 'type must be teach or learn' }, { status: 400 });
    }

    if (type === 'teach') {
      const skill = await db.skillTeach.create({
        data: { userId, skillName, category: category || null },
      });
      return NextResponse.json({ skill, type: 'teach' }, { status: 201 });
    } else {
      const skill = await db.skillLearn.create({
        data: { userId, skillName, category: category || null },
      });
      return NextResponse.json({ skill, type: 'learn' }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error adding skill:', error);
    return NextResponse.json({ error: 'Failed to add skill', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get('skillId');
    const type = searchParams.get('type');

    if (!skillId || !type) {
      return NextResponse.json({ error: 'skillId and type query parameters are required' }, { status: 400 });
    }

    if (type === 'teach') {
      const skill = await db.skillTeach.findUnique({ where: { id: skillId } });
      if (!skill) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }
      await db.skillTeach.delete({ where: { id: skillId } });
      return NextResponse.json({ message: 'Skill removed successfully' });
    } else if (type === 'learn') {
      const skill = await db.skillLearn.findUnique({ where: { id: skillId } });
      if (!skill) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }
      await db.skillLearn.delete({ where: { id: skillId } });
      return NextResponse.json({ message: 'Skill removed successfully' });
    } else {
      return NextResponse.json({ error: 'type must be teach or learn' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error removing skill:', error);
    return NextResponse.json({ error: 'Failed to remove skill', details: error.message }, { status: 500 });
  }
}
