import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { generateCertificatePDF } from '@/lib/pdf';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    const body = await req.json();
    const { courseId } = body;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: { where: { isPublished: true } },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Kurs topilmadi' }, { status: 404 });
    }

    const totalLessons = course.lessons.length;
    const completedLessons = await prisma.userProgress.count({
      where: {
        userId: user.id,
        courseId,
        completed: true,
        lessonId: { in: course.lessons.map((l) => l.id) },
      },
    });

    if (completedLessons < totalLessons) {
      return NextResponse.json(
        { error: `Barcha ${totalLessons} darslarni tugating (${completedLessons}/${totalLessons})` },
        { status: 400 }
      );
    }

    const uniqueId = `CERT-${Date.now()}-${user.id.slice(0, 8).toUpperCase()}`;

    const certificate = await prisma.certificate.create({
      data: {
        uniqueId,
        userId: user.id,
        courseId,
        courseName: course.title,
        studentName: user.fullName || user.username,
        verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${uniqueId}`,
      },
    });

    // Generate PDF asynchronously
    generateCertificatePDF({
      studentName: user.fullName || user.username,
      courseName: course.title,
      date: new Date(),
      uniqueId,
      verificationUrl: certificate.verificationUrl,
    }).catch(console.error);

    return NextResponse.json({ success: true, certificate });
  } catch {
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    const certificates = await prisma.certificate.findMany({
      where: { userId: user.id },
      orderBy: { issuedAt: 'desc' },
    });

    return NextResponse.json({ certificates });
  } catch {
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}