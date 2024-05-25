"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { ConversationContext } from "@/context/ConversationContext";
import FormInput from "../components/FormInput";

import classes from "./page.module.css";

export default function Home() {
  const { token } = useContext(AuthContext);
  const { addConversation } = useContext(ConversationContext);
  const router = useRouter();

  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text) return;

    setLoading(true);
    setError(null);
    fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
      body: JSON.stringify({ content: text }),
    })
      .then((res) => res.json())
      .then((data: { id: string }) => {
        console.log(data);
        addConversation({
          id: data.id,
          title: text,
        });
        router.push(`/conversations/${data.id}`);
      })
      .catch((error: Error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className={classes.content}>
        {error && <div className={classes.error}>{error.message}</div>}
      </div>
      <FormInput
        disabled={loading}
        handleSubmit={onSubmit}
        text={text}
        handleTextChange={setText}
      />
    </>
  );
}
