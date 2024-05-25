"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Conversation } from "@/types/conversation";

import classes from "./ConversationItem.module.css";

type ConversationItemProps = {
  className?: string;
  conversation: Conversation;
};

export default function ConversationItem({
  className,
  conversation,
}: ConversationItemProps) {
  const pathname = usePathname();

  const href = `/conversations/${conversation.id}`;
  const isActive = pathname === href;

  return (
    <Link
      className={`${className} ${isActive ? classes.active : ""}`}
      href={href}
    >
      {conversation.title}
    </Link>
  );
}
