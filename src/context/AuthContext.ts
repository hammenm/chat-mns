import { createContext } from "react";
import { User as UserPrisma } from "@prisma/client";

type User = Omit<UserPrisma, "password">;

export type Auth = {
  user: User | null;
  token: string | null;
};

type ContextProps = {
  user: User | null;
  token: string | null;
  setAuth: (auth: Auth) => void;
  isAuthenticated: boolean;
  logout: () => void;
};

export const AuthContext = createContext({
  user: null,
  token: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAuth: () => {},
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
} as ContextProps);
