import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { sendEmail, welcomeEmailTemplate } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password, fullName } = body;

    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'Barcha maydonlarni to\'ldiring' },
        { status: 400 }
      );
    }

    const result = await registerUser({ email, username, password, fullName });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    // Send welcome email
    await sendEmail({
      to: email,
      subject: '🛡️ CyberUz Academy ga xush kelibsiz!',
      html: welcomeEmailTemplate(fullName || username),
    }).catch(console.error);

    // Set cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        fullName: result.user.fullName,
        role: result.user.role,
        xp: result.user.xp,
        level: result.user.level,
      },
    });

    response.cookies.set('access_token', result.accessToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    response.cookies.set('refresh_token', result.refreshToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'Server xatosi' },
      { status: 500 }
    );
  }
}