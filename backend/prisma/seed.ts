import { PrismaClient } from '@prisma/client';

import { hashPassword } from '../src/utils/hashPassword';

const prisma = new PrismaClient();

const USERS = [
  { email: 'member@me.com', role: 'MEMBER' as const },
  { email: 'mentor@me.com', role: 'MENTOR' as const },
  { email: 'admin@me.com', role: 'ADMIN' as const },
];

const seed = async () => {
  const password = await hashPassword('Karma');

  await Promise.all(
    USERS.map((user) =>
      prisma.profile.upsert({
        where: { email: user.email },
        create: {
          email: user.email,
          password,
          role: user.role,
        },
        update: {
          password,
          role: user.role,
        },
      }),
    ),
  );
};

seed()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('✅ Seeded Member, Mentor, and Admin users');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Seeding failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
