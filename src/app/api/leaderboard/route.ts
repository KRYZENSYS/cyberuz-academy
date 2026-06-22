import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'all';

    const users = await prisma.user.findMany({
      where: { isBanned: false },
      orderBy: { xp: 'desc' },
      take: 100,
      select: {
        id: true,
        fullName: true,
        username: true,
        xp: true,
        level: true,
        streak: true,
        avatar: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}