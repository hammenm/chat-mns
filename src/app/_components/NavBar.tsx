import { useContext } from "react";
import Link from "next/link";
import ConversationItem from "./ConversationItem";
import { type Conversation } from "@/types/conversation";
import { AuthContext } from "@/context/AuthContext";

import classes from "./Navbar.module.css";

type NavBarProps = {
  conversations: Conversation[];
  loading: boolean;
  error: Error | null;
};

export default function NavBar({ conversations, loading, error }: NavBarProps) {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className={classes.root}>
      <h1 className={classes.title}>
        <Link href="/">chatMNS</Link>
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && conversations.length === 0 && (
        <p>No conversations yet</p>
      )}
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <ConversationItem
              className={classes.item}
              conversation={conversation}
            />
          </li>
        ))}
      </ul>
      {/* Spacer */}
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {!isAuthenticated ? (
          <>
            <Link href="/auth/login">Login</Link>
            <span className={classes.divider}>/</span>
            <Link href="/auth/signup">Signup</Link>
          </>
        ) : (
          <button onClick={() => logout()}>Logout</button>
        )}
      </div>
    </nav>
  );
}
