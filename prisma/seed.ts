import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const timestamp = new Date();

  const user1 = await prisma.user.upsert({
    where: { email: "user1@example.com" },
    update: {},
    create: {
      email: "user1@example.com",
      password: "password",
      conversations: {
        create: {
          messages: {
            create: [
              {
                role: Role.user,
                content: "Where can I buy bitcoin?",
                timestamp: timestamp,
              },
              {
                role: Role.assistant,
                content: "You can buy bitcoin on an exchange.",
                timestamp: new Date(timestamp.getTime() + 2000),
              },
              {
                role: Role.user,
                content: "What is an exchange?",
                timestamp: new Date(timestamp.getTime() + 5000),
              },
              {
                role: Role.assistant,
                content:
                  "An exchange is a platform where you can buy and sell cryptocurrencies.",
                timestamp: new Date(timestamp.getTime() + 7000),
              },
            ],
          },
        },
      },
    },
  });

  console.log({ user1 });

  const conversationPublic1 = await prisma.conversation.upsert({
    where: { id: "conversationPublicSeed1" },
    update: {},
    create: {
      id: "conversationPublicSeed1",
      messages: {
        create: [
          {
            role: Role.user,
            content: "Hello!",
            timestamp: timestamp,
          },
          {
            role: Role.assistant,
            content: "Hi!",
            timestamp: new Date(timestamp.getTime() + 2000),
          },
          {
            role: Role.user,
            content: "How are you?",
            timestamp: new Date(timestamp.getTime() + 5000),
          },
          {
            role: Role.assistant,
            content: "I'm fine, thank you!",
            timestamp: new Date(timestamp.getTime() + 7000),
          },
        ],
      },
    },
  });

  const conversationPublic2 = await prisma.conversation.upsert({
    where: { id: "conversationPublicSeed2" },
    update: {},
    create: {
      id: "conversationPublicSeed2",
      messages: {
        create: [
          {
            role: Role.user,
            content: "What's the weather like in London?",
            timestamp: timestamp,
          },
          {
            role: Role.assistant,
            content: "I am sorry, I cannot provide real-time information.",
            timestamp: new Date(timestamp.getTime() + 2000),
          },
          {
            role: Role.user,
            content: "What's your name?",
            timestamp: new Date(timestamp.getTime() + 5000),
          },
          {
            role: Role.assistant,
            content: "I am a bot",
            timestamp: new Date(timestamp.getTime() + 7000),
          },
        ],
      },
    },
  });

  console.log({ conversationPublic1, conversationPublic2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
