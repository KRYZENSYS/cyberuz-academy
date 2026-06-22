import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const learningPath = url.searchParams.get('learningPath');
    const difficulty = url.searchParams.get('difficulty');
    const featured = url.searchParams.get('featured');

    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        ...(learningPath && { learningPath: learningPath as any }),
        ...(difficulty && { difficulty: difficulty as any }),
        ...(featured === 'true' && { isFeatured: true }),
      },
      orderBy: [{ isFeatured: 'desc' }, { enrollmentCount: 'desc' }],
      include: {
        _count: { select: { lessons: true } },
      },
    });

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error('Courses error:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}