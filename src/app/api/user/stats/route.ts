import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    const [lessonsCompleted, coursesCompleted, certificates, comments, certificateList] = await Promise.all([
      prisma.userProgress.count({ where: { userId: user.id, completed: true } }),
      prisma.userProgress.groupBy({
        by: ['courseId'],
        where: { userId: user.id, completed: true },
        _count: { _all: true },
      }).then(async (groups) => {
        // Count courses where all lessons are completed
        let completed = 0;
        for (const group of groups) {
          const totalLessons = await prisma.lesson.count({ where: { courseId: group.courseId } });
          if (group._count._all >= totalLessons && totalLessons > 0) completed++;
        }
        return completed;
      }),
      prisma.certificate.count({ where: { userId: user.id } }),
      prisma.comment.count({ where: { userId: user.id } }),
      prisma.certificate.findMany({
        where: { userId: user.id },
        orderBy: { issuedAt: 'desc' },
        take: 10,
        select: {
          id: true,
          uniqueId: true,
          courseName: true,
          issuedAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        lessonsCompleted,
        coursesCompleted,
        certificates,
        comments,
        certificateList,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}