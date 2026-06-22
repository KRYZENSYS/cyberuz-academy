import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin panelga kirish taqiqlangan' }, { status: 403 });
    }

    const [totalUsers, totalCourses, totalLessons, activeUsers] = await Promise.all([
      prisma.user.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.lesson.count({ where: { isPublished: true } }),
      prisma.userProgress.count({ where: { completed: true } }),
    ]);

    return NextResponse.json({
      stats: { totalUsers, totalCourses, totalLessons, activeUsers },
    });
  } catch {
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}