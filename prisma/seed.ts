import { PrismaClient } from '@prisma/client';
import { Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password: 'password',
      conversations: {
        create: {
          messages: {
            create: {
              role: Role.USER,
              content: 'Hello!',
            },
          },
        },
      },
    },
  });

  console.log({ user1 });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
