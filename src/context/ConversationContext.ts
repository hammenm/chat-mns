import { createContext } from "react";
import { type Conversation } from "@/types/conversation";

type ContextProps = {
  conversations: Conversation[];
  addConversation: (conversation: Conversation) => void;
};

export const ConversationContext = createContext({
  conversations: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addConversation: () => {},
} as ContextProps);
