import { z } from "zod";
import { getAuthUser } from "@/lib/auth";
import { askGPT } from "@/lib/gpt";
import db from "@/server/db";
import { Role } from "@prisma/client";
import { errorResponseNotFound } from "@/lib/errors";

export const dynamic = "force-dynamic";

const schema = z.object({
  content: z.string(),
});

export async function POST(
  request: Request,
  context: { params: { conversationId: string } },
) {
  const timestamp = new Date();
  const conversationId = context.params.conversationId;
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

  const conversation = await db.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      messages: {
        select: {
          content: true,
          role: true,
        },
      },
    },
  });

  if (!conversation) {
    return errorResponseNotFound();
  }

  if (conversation.userId !== null) {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return errorResponseNotFound();
    }

    if (conversation.userId !== authUser.id) {
      return errorResponseNotFound();
    }
  }

  const { content } = response.data;

  const messageGPT = await askGPT([
    ...conversation.messages,
    {
      role: Role.user,
      content,
    },
  ]);

  const conversationUpdated = await db.conversation.update({
    where: {
      id: conversation.id,
    },
    data: {
      messages: {
        create: [
          {
            role: Role.user,
            content,
            timestamp,
          },
          messageGPT,
        ],
      },
    },
    include: {
      messages: {
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          content: true,
          role: true,
          timestamp: true,
        },
        take: 2,
      },
    },
  });

  return new Response(JSON.stringify(conversationUpdated), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
