import { PrismaClient } from "@prisma/client";

import { env } from "@/env.js";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    result: {
      user: {
        password: {
          needs: {},
          compute() {
            return undefined;
          },
        },
      },
    },
  });
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
