import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { chatWithAI } from '@/lib/ai';
import { fetchYouTubeVideo } from '@/lib/youtube';

export const dynamic = 'force-dynamic';
export const maxDuration = 600;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let newsCreated = 0;
    let lessonsCreated = 0;

    // Generate news via AI
    const newsPrompt = `Kiberxavfsizlik sohasida bugungi eng muhim 3 ta yangilikni yoz. O'zbek tilida, qisqa (150-200 so'z), professional. JSON formatda: [{"title": "...", "excerpt": "...", "content": "...", "category": "..."}]`;
    try {
      const newsText = await chatWithAI(newsPrompt, { systemPrompt: 'Siz kiberxavfsizlik yangiliklari muharrirsiz. Faqat JSON qaytaring.' });
      const newsData = JSON.parse(newsText.match(/\[[\s\S]*\]/)?.[0] || '[]');
      
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
    } catch (e) {
      console.error('News generation failed:', e);
    }

    // Auto-add lessons from YouTube for empty courses
    const coursesWithoutLessons = await prisma.course.findMany({
      where: { isPublished: true, lessons: { none: {} } },
      take: 5,
    });

    for (const course of coursesWithoutLessons) {
      try {
        const query = `${course.title} tutorial cybersecurity o'zbek tilida`;
        const videos = await fetchYouTubeVideo(query);
        
        for (let i = 0; i < Math.min(5, videos.length); i++) {
          const video = videos[i];
          await prisma.lesson.create({
            data: {
              courseId: course.id,
              title: `${course.title} - Dars ${i + 1}`,
              description: video.description?.substring(0, 200) || '',
              order: i + 1,
              isPublished: true,
              duration: video.duration || 0,
              video: {
                create: {
                  youtubeId: video.id,
                  title: video.title,
                  thumbnail: video.thumbnail,
                  duration: video.duration || 0,
                  channelTitle: video.channelTitle,
                  description: video.description,
                },
              },
            },
          });
          lessonsCreated++;
        }
      } catch (e) {
        console.error(`Failed to add lessons to ${course.title}:`, e);
      }
    }

    return NextResponse.json({
      success: true,
      newsCreated,
      lessonsCreated,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}