import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { sendEmail, welcomeEmailTemplate } from '@/lib/email';
import { generateRandomToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password, fullName } = body;

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username va parol talab qilinadi' },
        { status: 400 }
      );
    }

    const result = await registerUser({ email, username, password, fullName });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Generate email verification token
    const verifyToken = generateRandomToken();
    await prisma.user.update({
      where: { id: result.user.id },
      data: { emailVerifyToken: verifyToken },
    });

    // Send welcome email
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}`;
    await sendEmail({
      to: email,
      subject: 'CyberUz Academy — Xush kelibsiz!',
      html: welcomeEmailTemplate(fullName || username),
    });

    // Set cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        fullName: result.user.fullName,
      },
      accessToken: result.accessToken,
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
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 });
  }
}