import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, skillsTeach, skillsLearn } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (!Array.isArray(skillsTeach) || !Array.isArray(skillsLearn)) {
      return NextResponse.json(
        { error: 'skillsTeach and skillsLearn must be arrays' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const result = await db.$transaction(async (tx) => {
      // Delete existing skills
      await tx.skillTeach.deleteMany({ where: { userId } });
      await tx.skillLearn.deleteMany({ where: { userId } });

      // Create new teach skills
      if (skillsTeach.length > 0) {
        await tx.skillTeach.createMany({
          data: skillsTeach.map((skill: string) => ({
            userId,
            skillName: skill,
            category: null,
          })),
        });
      }

      // Create new learn skills
      if (skillsLearn.length > 0) {
        await tx.skillLearn.createMany({
          data: skillsLearn.map((skill: string) => ({
            userId,
            skillName: skill,
            category: null,
          })),
        });
      }

      // Mark onboarding as complete and upgrade role to COACH if they have teach skills
      const updateData: any = {
        onboardingCompleted: true,
      };

      if (skillsTeach.length > 0) {
        updateData.role = 'COACH';
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: updateData,
        include: {
          skillsTeach: true,
          skillsLearn: true,
        },
      });

      return updatedUser;
    });

    return NextResponse.json({ user: result });
  } catch (error: any) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json({ error: 'Failed to complete onboarding', details: error.message }, { status: 500 });
  }
}
