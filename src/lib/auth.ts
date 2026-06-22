import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, type TokenPayload } from './jwt';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  fullName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const { email, username, password, fullName } = input;

  // Validate email
  if (!isValidEmail(email)) {
    return { success: false, error: 'Noto\'g\'ri email formati' };
  }

  // Validate password
  if (password.length < 8) {
    return { success: false, error: 'Parol kamida 8 belgidan iborat bo\'lishi kerak' };
  }

  // Check existing user
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    if (existing.email === email) return { success: false, error: 'Bu email allaqachon ro\'yxatdan o\'tgan' };
    if (existing.username === username) return { success: false, error: 'Bu username band' };
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      fullName,
      profile: { create: {} },
    },
    include: { profile: true },
  });

  const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.userSession.create({
    data: {
      userId: user.id,
      token: accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { success: true, user, accessToken, refreshToken };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user) {
    return { success: false, error: 'Email yoki parol noto\'g\'ri' };
  }

  if (user.isBanned) {
    return { success: false, error: 'Akkaunt bloklangan' };
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    await prisma.loginHistory.create({
      data: { userId: user.id, success: false, failReason: 'Invalid password' },
    });
    return { success: false, error: 'Email yoki parol noto\'g\'ri' };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastActiveAt: new Date() },
  });

  const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.userSession.create({
    data: {
      userId: user.id,
      token: accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.loginHistory.create({
    data: { userId: user.id, success: true },
  });

  return { success: true, user, accessToken, refreshToken };
}

export async function getCurrentUser(): Promise<any | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  return prisma.user.findUnique({
    where: { id: payload.userId },
    include: { profile: true },
  });
}

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return null;

  return generateAccessToken({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  });
}

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidUsername(username: string): boolean {
  const re = /^[a-zA-Z0-9_]{3,30}$/;
  return re.test(username);
}
