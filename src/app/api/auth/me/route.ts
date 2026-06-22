import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        emailVerified: user.emailVerified,
        profile: user.profile,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}