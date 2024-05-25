import classes from "./Message.module.css";

type MessageProps = {
  content: string;
  role: "assistant" | "user";
};

export default function Message({ content, role }: MessageProps) {
  const alt = role === "assistant" ? "Assistant" : "User";
  const src =
    role === "assistant"
      ? "https://avatars.githubusercontent.com/u/97165289"
      : "https://avatars.githubusercontent.com/u/9029787";

  return (
    <div
      className={`${classes.root} ${role === "assistant" ? classes.assistant : classes.user}`}
    >
      <div className={classes.message}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={classes.image}
            src={src}
            alt={alt}
            width={36}
            height={36}
          />
        </div>
        <div className={classes.content}>{content}</div>
      </div>
    </div>
  );
}
