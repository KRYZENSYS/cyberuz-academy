import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { chatWithAI } from '@/lib/ai';

export const dynamic = 'force-dynamic';
export const maxDuration = 600;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let newsCreated = 0;

    const newsPrompt = `Kiberxavfsizlik sohasida bugungi eng muhim 3 ta yangilikni yoz. O'zbek tilida, qisqa (150-200 so'z), professional. JSON formatda: [{"title": "...", "excerpt": "...", "content": "...", "category": "..."}]`;
    try {
      const newsText = await chatWithAI(newsPrompt, {
        systemPrompt: "Siz kiberxavfsizlik yangiliklari muharrirsiz. Faqat JSON qaytaring.",
      });
      const jsonMatch = newsText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const newsData = JSON.parse(jsonMatch[0]);
        for (const item of newsData) {
          const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          await prisma.news.create({
            data: {
              title: item.title,
              slug,
              excerpt: item.excerpt,
              content: item.content,
              category: item.category || 'Cybersecurity',
              published: true,
              publishedAt: new Date(),
            },
          });
          newsCreated++;
        }
      }
    } catch (e) {
      console.error('News generation failed:', e);
    }

    return NextResponse.json({
      success: true,
      newsCreated,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}