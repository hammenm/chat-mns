"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Auth, AuthContext } from "@/context/AuthContext";

import classes from "@/app/auth/page.module.css";

type MutationOptions = {
  onSuccess?: (data: Auth) => void;
};

function useSignupMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (credentials: object, options: MutationOptions = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = (await res.json()) as Auth;

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, isError: !!error, error };
}

export default function SignupPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();
  const mutation = useSignupMutation();
  const { setAuth } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) return;
    if (mutation.isLoading) return;

    await mutation.mutate(
      { email, password },
      {
        onSuccess: (data: Auth) => {
          setAuth(data);
          router.push("/");
        },
      },
    );
  };

  return (
    <>
      <div className={classes.content}>
        <div className={classes.spacer} />
        <div className={classes.card}>
          <div className={classes.cardContent}>
            <h1 className={classes.title}>Sign up</h1>
            <form className={classes.form} onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input
                disabled={mutation.isLoading}
                type="email"
                id="email"
                name="email"
                className={classes.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="password">Password</label>
              <input
                disabled={mutation.isLoading}
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                className={classes.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {mutation.isError && (
                <div className={classes.error}>{mutation.error?.message}</div>
              )}
              <button
                disabled={mutation.isLoading}
                type="submit"
                className={classes.button}
              >
                Sign up
              </button>
            </form>
            <Link href="/auth/login">
              <span className={classes.link}>
                Already have an account? Login
              </span>
            </Link>
          </div>
        </div>
        <div className={classes.spacer} />
      </div>
    </>
  );
}
