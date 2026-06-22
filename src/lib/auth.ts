import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { generateAccessToken, generateRefreshToken, verifyToken } from './jwt';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatar: string | null;
  role: string;
  xp: number;
  level: number;
  streak: number;
  emailVerified: boolean;
  profile: any;
}

export async function registerUser(data: {
  email: string;
  username: string;
  password: string;
  fullName?: string;
}): Promise<{ success: boolean; user?: AuthUser; accessToken?: string; refreshToken?: string; error?: string }> {
  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] },
    });

    if (existing) {
      if (existing.email === data.email) return { success: false, error: 'Bu email allaqachon ro\'yxatdan o\'tgan' };
      return { success: false, error: 'Bu username band' };
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        fullName: data.fullName,
        password: passwordHash,
      },
    });

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await prisma.activityLog.create({
      data: { userId: user.id, type: 'user_registered', message: `${user.username} ro'yxatdan o'tdi`, metadata: { email: user.email } },
    });

    return {
      success: true,
      user: {
        id: user.id, email: user.email, username: user.username, fullName: user.fullName,
        avatar: user.avatar, role: user.role, xp: user.xp, level: user.level,
        streak: user.streak, emailVerified: user.emailVerified, profile: user.profile,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Server xatoligi' };
  }
}

export async function loginUser(data: { email: string; password: string }): Promise<{ success: boolean; user?: AuthUser; accessToken?: string; refreshToken?: string; error?: string }> {
  try {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || user.isBanned) return { success: false, error: 'Email yoki parol noto\'g\'ri' };

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return { success: false, error: 'Email yoki parol noto\'g\'ri' };

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });
    await prisma.activityLog.create({
      data: { userId: user.id, type: 'user_login', message: `${user.username} tizimga kirdi` },
    });

    return {
      success: true,
      user: {
        id: user.id, email: user.email, username: user.username, fullName: user.fullName,
        avatar: user.avatar, role: user.role, xp: user.xp, level: user.level,
        streak: user.streak, emailVerified: user.emailVerified, profile: user.profile,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Server xatoligi' };
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.isBanned) return null;

    return {
      id: user.id, email: user.email, username: user.username, fullName: user.fullName,
      avatar: user.avatar, role: user.role, xp: user.xp, level: user.level,
      streak: user.streak, emailVerified: user.emailVerified, profile: user.profile,
    };
  } catch {
    return null;
  }
}