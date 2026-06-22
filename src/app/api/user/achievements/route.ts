import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    const allAchievements = await prisma.achievement.findMany({ where: { isActive: true } });
    const userAchievements = await prisma.userAchievement.findMany({ where: { userId: user.id } });
    const unlockedMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

    const achievements = allAchievements.map((ach) => {
      const userAch = unlockedMap.get(ach.id);
      return {
        ...ach,
        completed: userAch?.completed || false,
        progress: userAch?.progress || 0,
        unlockedAt: userAch?.unlockedAt,
      };
    });

    return NextResponse.json({ achievements });
  } catch (error) {
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}