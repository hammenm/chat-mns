"use client";

import { useEffect, useState } from "react";
import { type Auth, AuthContext } from "@/context/AuthContext";
import { ConversationContext } from "@/context/ConversationContext";
import NavBar from "./_components/NavBar";
import { type Conversation } from "@/types/conversation";
import "@/styles/globals.css";
import classes from "./layout.module.css";

const useConversations = (auth: Auth) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Fetch /api/conversations
    fetch("/api/conversations", {
      ...(auth.token && {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }),
    })
      .then((res) => res.json())
      .then(setConversations)
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [auth.token]);

  const addConversation = (conversation: Conversation) => {
    setConversations((conversations) => [conversation, ...conversations]);
  };

  return { conversations, addConversation, loading, error };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [auth, setAuth] = useState<Auth>({
    user: null,
    token: null,
  });
  const { conversations, addConversation, loading, error } =
    useConversations(auth);

  return (
    <html lang="en">
      <body>
        <AuthContext.Provider
          value={{
            user: auth.user,
            token: auth.token,
            setAuth: (auth: Auth) => {
              setAuth(auth);
            },
            isAuthenticated: !!auth.user,
            logout: () => {
              setAuth({ user: null, token: null });
            },
          }}
        >
          <ConversationContext.Provider
            value={{
              conversations,
              addConversation: (conversation: Conversation) => {
                addConversation(conversation);
              },
            }}
          >
            <div className={classes.root}>
              <NavBar
                conversations={conversations}
                loading={loading}
                error={error}
              />
              <main className={classes.content}>{children}</main>
            </div>
          </ConversationContext.Provider>
        </AuthContext.Provider>
      </body>
    </html>
  );
}
