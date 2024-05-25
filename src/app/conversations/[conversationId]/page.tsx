"use client";

import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import FormInput from "@/components/FormInput";
import Message from "./Message";
import MessageLoading from "./MessageLoading";

import classes from "./page.module.css";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
};

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { token } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingInit, setLoadingInit] = useState<boolean>(true);
  const [errorInit, setErrorInit] = useState<Error | null>(null);
  const [loadingResponse, setLoadingResponse] = useState<boolean>(false);
  const [errorResponse, setErrorResponse] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch /api/conversations
    setLoadingInit(true);
    setErrorInit(null);
    fetch(`/api/conversations/${conversationId}`, {
      ...(token && {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    })
      .then((res) => res.json())
      .then((data: { messages: Message[] }) => {
        setMessages(data.messages);
      })
      .catch((error: Error) => {
        setErrorInit(error);
      })
      .finally(() => {
        setLoadingInit(false);
      });
  }, [conversationId, token]);

  const disabledForm = loadingResponse || !!errorResponse;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || disabledForm) return;

    setLoadingResponse(true);
    setErrorResponse(null);

    // POST /api/conversations/:conversationId
    fetch(`/api/conversations/${conversationId}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
      body: JSON.stringify({ content: input }),
    })
      .then((res) => res.json())
      .then((data: { messages: Message[] }) => {
        setMessages((messagesPrev) => [...messagesPrev, ...data.messages]);
        setInput("");
      })
      .catch((error: Error) => {
        setErrorResponse(error);
      })
      .finally(() => {
        setLoadingResponse(false);
      });
  };

  return (
    <>
      <div className={classes.content}>
        {loadingInit && <p>Loading...</p>}
        {errorInit && <p>Error: {errorInit.message}</p>}
        {messages.map((message) => (
          <Message
            key={message.id}
            content={message.content}
            role={message.role}
          />
        ))}
        {loadingResponse && <MessageLoading />}
        {errorResponse && (
          <Message
            role="assistant"
            content={`Error: ${errorResponse.message}`}
          />
        )}
      </div>
      <FormInput
        disabled={disabledForm}
        handleSubmit={onSubmit}
        text={input}
        handleTextChange={setInput}
      />
    </>
  );
}
