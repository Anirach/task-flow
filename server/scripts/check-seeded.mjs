// Exit 0 if database is empty (needs seeding), exit 1 if already has data
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
try {
  const count = await prisma.user.count();
  await prisma.$disconnect();
  process.exit(count === 0 ? 0 : 1);
} catch {
  await prisma.$disconnect();
  process.exit(0); // Error means DB might be empty/new, try seeding
}
