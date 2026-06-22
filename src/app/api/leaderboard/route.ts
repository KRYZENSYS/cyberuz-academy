import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'all';

    const now = new Date();
    let startDate = new Date(0);
    if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const users = await prisma.user.findMany({
      where: { xp: { gt: 0 }, createdAt: { gte: startDate } },
      orderBy: { xp: 'desc' },
      take: 100,
      select: {
        id: true,
        fullName: true,
        username: true,
        xp: true,
        level: true,
        avatar: true,
      },
    });

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}