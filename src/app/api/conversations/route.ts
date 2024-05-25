import { z } from "zod";
import { getAuthUser } from "@/lib/auth";
import { askGPT } from "@/lib/gpt";
import db from "@/server/db";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const userAuth = getAuthUser(request);

  const where = userAuth
    ? { userId: userAuth.id }
    : {
        user: {
          is: null,
        },
      };

  const conversations = await db.conversation.findMany({
    where,
    select: {
      id: true,
      messages: {
        orderBy: {
          timestamp: "asc",
        },
        take: 1,
        select: {
          content: true,
          timestamp: true,
        },
      },
    },
  });

  // Map by removing messages and adding title
  const conversationsMapped = conversations.map(
    ({ messages, ...conversation }) => {
      const firstMessage = messages[0];
      return {
        ...conversation,
        title: firstMessage?.content,
        createdAt: firstMessage?.timestamp,
      };
    },
  );

  return new Response(JSON.stringify(conversationsMapped), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const schema = z.object({
  content: z.string(),
});

export async function POST(request: Request) {
  const response = schema.safeParse(await request.json());

  if (!response.success) {
    return new Response(
      JSON.stringify({
        message: response.error.issues.map((issue) => issue.message).join(", "),
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const timestamp = new Date();
  const { content } = response.data;
  const userAuth = getAuthUser(request);

  let messageGPT;
  try {
    messageGPT = await askGPT([
      {
        content,
        role: Role.assistant,
      },
    ]);
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error asking GPT" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  let conversation;
  try {
    conversation = await db.conversation.create({
      data: {
        userId: userAuth?.id,
        messages: {
          create: [
            {
              content,
              role: "user",
              timestamp,
            },
            {
              content: messageGPT.content,
              role: Role.assistant,
              timestamp: new Date(),
            },
          ],
        },
      },
      include: {
        messages: {
          select: {
            content: true,
            role: true,
            timestamp: true,
          },
        },
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error creating conversation" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  return new Response(JSON.stringify(conversation), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
