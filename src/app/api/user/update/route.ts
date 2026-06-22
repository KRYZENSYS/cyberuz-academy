import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, bio, avatar } = body;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: fullName || user.fullName,
        ...(avatar && { avatar }),
        profile: {
          upsert: {
            create: { bio: bio || '' },
            update: { bio: bio || '' },
          },
        },
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}