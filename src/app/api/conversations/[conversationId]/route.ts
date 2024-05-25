import { getAuthUser } from "@/lib/auth";
import db from "@/server/db";
import { errorResponseNotFound } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: { conversationId: string } },
) {
  const conversationId = context.params.conversationId;
  const userAuth = getAuthUser(request);

  const conversation = await db.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      messages: {
        select: {
          id: true,
          content: true,
          role: true,
          timestamp: true,
        },
      },
    },
  });

  if (conversation && conversation.userId !== null) {
    if (!userAuth) {
      return errorResponseNotFound();
    }

    if (conversation.userId !== userAuth.id) {
      return errorResponseNotFound();
    }

    return new Response(JSON.stringify(conversation), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (!conversation) {
    return errorResponseNotFound();
  }

  return new Response(JSON.stringify(conversation), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
