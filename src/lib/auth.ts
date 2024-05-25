import { sign, verify } from "jsonwebtoken";
import { type User } from "@prisma/client";

export function getAuthResponseBody(user: User) {
  const userCopied = { ...user } as Partial<User>;
  delete userCopied.password;

  return {
    user: userCopied,
    token: sign(userCopied, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    }),
  };
}

export function getAuthUser(req: Request) {
  const authorization = req.headers?.get("authorization");
  const token = authorization?.split(" ")[1];

  if (token) {
    return verify(token, process.env.JWT_SECRET!) as { id: string };
  }
}
