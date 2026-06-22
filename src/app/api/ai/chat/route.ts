import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI, analyzeVideoContent, generateQuiz } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { message, lessonId, conversationId, history } = body;

    if (!message) {
      return NextResponse.json({ error: 'Xabar yuborilmadi' }, { status: 400 });
    }

    // Get lesson context if provided
    let context: any = {};
    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { course: true },
      });
      if (lesson) {
        context = {
          lessonTitle: lesson.title,
          courseTitle: lesson.course?.title,
        };
      }
    }

    if (history) context.history = history;

    // Get AI response
    const response = await chatWithAI(message, context);

    // Save conversation if user is logged in
    if (user) {
      let convId = conversationId;
      if (!convId) {
        const conv = await prisma.aIConversation.create({
          data: { userId: user.id, title: message.substring(0, 100) },
        });
        convId = conv.id;
      }
      await prisma.aIMessage.createMany({
        data: [
          { conversationId: convId, role: 'user', content: message },
          { conversationId: convId, role: 'assistant', content: response },
        ],
      });
    }

    return NextResponse.json({ success: true, response, conversationId });
  } catch (error: any) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'AI xatosi' }, { status: 500 });
  }
}