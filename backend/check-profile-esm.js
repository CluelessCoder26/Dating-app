import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'sarveshvedha20@gmail.com' },
    include: { profile: true }
  });
  console.log('Profile:', user ? (user.profile ? 'Exists' : 'Null') : 'User not found');
}

main().finally(() => prisma.$disconnect());
