import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    // Find users who were active yesterday but not today
    const users = await prisma.user.findMany({
      where: { streak: { gt: 0 } },
    });

    let updated = 0;
    for (const user of users) {
      const lastActive = user.lastActiveAt;
      if (!lastActive) continue;

      if (lastActive < twoDaysAgo) {
        // Reset streak
        await prisma.user.update({
          where: { id: user.id },
          data: { streak: 0 },
        });
        updated++;
      }
    }

    return NextResponse.json({
      success: true,
      streaksReset: updated,
    });
  } catch {
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}