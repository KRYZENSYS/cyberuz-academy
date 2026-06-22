import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/ai';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    const body = await req.json();
    const { message, conversationId, lessonTitle, courseTitle, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Xabar matni talab qilinadi' }, { status: 400 });
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.aIConversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId: user.id,
          title: message.substring(0, 100),
        },
      });
    }

    // Save user message
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
      },
    });

    // Get AI response
    const aiResponse = await chatWithAI(message, {
      lessonTitle,
      courseTitle,
      history,
    });

    // Save AI message
    const aiMessage = await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
      },
    });

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      response: aiResponse,
      messageId: aiMessage.id,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'AI xatoligi' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      const messages = await prisma.aIMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
      });
      return NextResponse.json({ messages });
    }

    const conversations = await prisma.aIConversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}