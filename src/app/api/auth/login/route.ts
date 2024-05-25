import { z } from "zod";
import db from "@/server/db";
import { getAuthResponseBody } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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

  const { email, password } = response.data;

  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!user || user.password !== password) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(
    JSON.stringify(getAuthResponseBody(user)),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
