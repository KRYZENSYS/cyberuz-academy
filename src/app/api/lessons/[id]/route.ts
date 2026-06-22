import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { addXP, updateStreak, checkAchievements } from '@/lib/gamification';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true,
        video: true,
        quizzes: {
          include: { questions: true },
          where: { isPublished: true },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Dars topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ lesson });
  } catch (error) {
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { progress, completed, watchTime } = body;

    // Update progress
    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_courseId_lessonId: {
          userId: user.id,
          courseId: body.courseId,
          lessonId: id,
        },
      },
      update: {
        progress: progress || 0,
        watchTime: watchTime || 0,
        lastWatchedAt: new Date(),
        completed: completed || false,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: user.id,
        courseId: body.courseId,
        lessonId: id,
        progress: progress || 0,
        watchTime: watchTime || 0,
        completed: completed || false,
        completedAt: completed ? new Date() : null,
      },
    });

    let xpResult: any = null;
    if (completed && !userProgress.completed) {
      xpResult = await addXP(user.id, 10, `Lesson completed: ${id}`);
      await updateStreak(user.id);
      const unlockedAchievements = await checkAchievements(user.id);

      return NextResponse.json({
        success: true,
        progress: userProgress,
        xpResult,
        unlockedAchievements,
      });
    }

    return NextResponse.json({ success: true, progress: userProgress });
  } catch (error) {
    console.error('Lesson progress error:', error);
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}