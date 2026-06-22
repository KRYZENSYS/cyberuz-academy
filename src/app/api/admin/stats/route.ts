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
      prisma.user.count({ where: { lastLoginAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    ]);

    return NextResponse.json({
      stats: { totalUsers, totalCourses, totalLessons, activeUsers },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}