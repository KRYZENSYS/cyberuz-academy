import { prisma } from './prisma';

export const XP_REWARDS = {
  LESSON_COMPLETED: 10,
  QUIZ_PASSED: 20,
  PERFECT_QUIZ: 50,
  COURSE_COMPLETED: 200,
  CERTIFICATE_EARNED: 100,
  DAILY_STREAK: 5,
  COMMENT_POSTED: 2,
  VIDEO_WATCHED: 5,
  CHALLENGE_COMPLETED: 50,
};

export function calculateLevel(xp: number): number {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

export async function addXP(userId: string, amount: number, reason: string): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const oldLevel = user.level;
  const newXP = user.xp + amount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > oldLevel;

  await prisma.user.update({
    where: { id: userId },
    data: { xp: newXP, level: newLevel },
  });

  await prisma.analytics.create({
    data: {
      event: 'xp_gained',
      userId,
      metadata: { amount, reason, oldXP: user.xp, newXP, oldLevel, newLevel },
    },
  });

  if (leveledUp) {
    await prisma.notification.create({
      data: {
        userId,
        type: 'ACHIEVEMENT',
        title: `🎉 Daraja oshdi!`,
        message: `Tabriklaymiz! Siz ${newLevel}-darajaga ko'tarildingiz!`,
        link: '/profile',
      },
    });
  }

  return { newXP, newLevel, leveledUp };
}

export async function updateStreak(userId: string): Promise<{ streak: number; isNewDay: boolean }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const now = new Date();
  const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;

  let isNewDay = false;
  let newStreak = user.streak;

  if (!lastActive) {
    newStreak = 1;
    isNewDay = true;
  } else {
    const hoursDiff = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
    if (hoursDiff >= 20 && hoursDiff < 48) {
      newStreak = user.streak + 1;
      isNewDay = true;
    } else if (hoursDiff >= 48) {
      newStreak = 1;
      isNewDay = true;
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { streak: newStreak, lastActiveAt: now },
  });

  if (isNewDay && newStreak > 1) {
    await addXP(userId, XP_REWARDS.DAILY_STREAK, `Daily streak: ${newStreak}`);
  }

  return { streak: newStreak, isNewDay };
}

export async function checkAchievements(userId: string): Promise<string[]> {
  const unlockedAchievements: string[] = [];

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      progress: true,
      certificates: true,
      comments: true,
      achievements: { include: { achievement: true } },
    },
  });

  if (!user) return [];

  const allAchievements = await prisma.achievement.findMany({ where: { isActive: true } });
  const unlockedIds = new Set(user.achievements.map((ua) => ua.achievementId));

  const completedLessons = user.progress.filter((p) => p.completed).length;
  const completedCourses = user.certificates.length;
  const commentsCount = user.comments.length;

  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement.id)) continue;

    const criteria = achievement.criteria as any;
    let shouldUnlock = false;

    switch (criteria.type) {
      case 'lessons_completed':
        shouldUnlock = completedLessons >= criteria.count;
        break;
      case 'courses_completed':
        shouldUnlock = completedCourses >= criteria.count;
        break;
      case 'xp':
        shouldUnlock = user.xp >= criteria.count;
        break;
      case 'daily_streak':
        shouldUnlock = user.streak >= criteria.count;
        break;
      case 'certificates':
        shouldUnlock = user.certificates.length >= criteria.count;
        break;
      case 'comments':
        shouldUnlock = commentsCount >= criteria.count;
        break;
    }

    if (shouldUnlock) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          completed: true,
          unlockedAt: new Date(),
        },
      });

      if (achievement.xpReward > 0) {
        await addXP(userId, achievement.xpReward, `Achievement: ${achievement.title}`);
      }

      await prisma.notification.create({
        data: {
          userId,
          type: 'ACHIEVEMENT',
          title: `🏆 Yangi yutuq!`,
          message: `${achievement.icon} ${achievement.title} - ${achievement.description}`,
          link: '/profile/achievements',
        },
      });

      unlockedAchievements.push(achievement.slug);
    }
  }

  return unlockedAchievements;
}

export async function getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'all-time', limit: number = 100) {
  const users = await prisma.user.findMany({
    where: { isBanned: false },
    orderBy: { xp: 'desc' },
    take: limit,
    select: {
      id: true,
      username: true,
      fullName: true,
      avatar: true,
      xp: true,
      level: true,
      streak: true,
    },
  });

  return users.map((user, index) => ({
    rank: index + 1,
    ...user,
  }));
}
