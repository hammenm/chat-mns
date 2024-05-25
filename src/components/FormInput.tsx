import classes from "./FormInput.module.css";

type FormInputProps = {
  disabled?: boolean;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  text: string;
  handleTextChange: (value: string) => void;
};

export default function FormInput({
  disabled = false,
  handleSubmit = (e) => e.preventDefault(),
  text,
  handleTextChange,
}: FormInputProps) {
  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <input
        disabled={disabled}
        className={classes.input}
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
      />
      <button disabled={disabled} className={classes.button} type="submit">
        Send
      </button>
    </form>
  );
}
