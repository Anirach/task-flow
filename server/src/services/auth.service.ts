import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '7d';

function signToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  role: true,
} as const;

export async function register(data: {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError(409, 'CONFLICT', 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      avatar: data.avatar || '',
      role: data.role || 'Member',
    },
    select: userSelect,
  });

  return { token: signToken(user.id), user };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  const { password: _, ...safeUser } = user;
  return { token: signToken(user.id), user: safeUser };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });
  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }
  return user;
}
