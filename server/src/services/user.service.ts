import { prisma } from '../lib/prisma.js';

export async function listUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, avatar: true, role: true },
    orderBy: { name: 'asc' },
  });
}
