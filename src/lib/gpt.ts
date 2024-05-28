import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export async function askGPT(
  messages: OpenAI.ChatCompletionMessageParam[],
  config?: Omit<
    OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
    "messages"
  >,
): Promise<Awaited<{ role: "assistant"; content: string }>> {
  if (!process.env.OPENAI_API_KEY || process.env.NODE_ENV === "development") {
    return Promise.resolve({
      role: "assistant",
      content: "Hello, I am a bot.",
    });
  }

  const chatCompletion = await openai.chat.completions.create({
    model: config?.model ?? "gpt-3.5-turbo",
    messages,
  });

  const [message] = chatCompletion.choices;

  if (!message) {
    throw new Error("No message returned from OpenAI");
  }

  return {
    role: "assistant",
    content: message.message.content!,
  };
}
