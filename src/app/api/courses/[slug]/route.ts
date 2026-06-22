import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            video: { select: { thumbnail: true, duration: true } },
          },
        },
        _count: {
          select: { lessons: true, certificates: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Kurs topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Course detail error:', error);
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}