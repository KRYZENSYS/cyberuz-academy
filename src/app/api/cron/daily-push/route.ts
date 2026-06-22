import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { chatWithAI } from '@/lib/ai';
import { sendEmail, dailyPushTemplate } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const startTime = Date.now();
    let emailsSent = 0;

    const users = await prisma.user.findMany({
      where: {
        dailyPushEnabled: true,
        emailVerified: true,
        isBanned: false,
      },
      take: 500,
    });

    const [trendingCourses, recentNews] = await Promise.all([
      prisma.course.findMany({
        where: { isPublished: true },
        orderBy: { enrollmentCount: 'desc' },
        take: 3,
      }),
      prisma.news.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
    ]);

    for (const user of users) {
      try {
        const prompt = `Foydalanuvchi: ${user.fullName || user.username}, Daraja: ${user.level}, XP: ${user.xp}, Streak: ${user.streak}. Kiberxavfsizlik bo'yicha 1 qiziqarli fakt, 1 maslahat, 1 tavsiya. Qisqa, do'stona o'zbek tilida. Emoji ishlat.`;
        const aiContent = await chatWithAI(prompt, {
          systemPrompt: "Siz CyberUz Academy AI assistentisiz. Foydalanuvchiga kiberxavfsizlik bo'yicha qisqa kundalik xabar yozing.",
        });

        await sendEmail({
          to: user.email,
          subject: `🌅 Bugungi kiber-xavfsizlik maslahatingiz — CyberUz`,
          html: dailyPushTemplate(user.fullName || user.username, aiContent, trendingCourses, recentNews),
        });

        await prisma.dailyPushLog.create({
          data: { userId: user.id, content: aiContent, sentAt: new Date() },
        });

        emailsSent++;
      } catch (e) {
        console.error(`Failed to send to ${user.email}:`, e);
      }
    }

    return NextResponse.json({
      success: true,
      usersProcessed: users.length,
      emailsSent,
      duration: Date.now() - startTime,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}