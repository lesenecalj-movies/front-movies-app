import { Movie } from "@/types/movie.types";
import styles from "../../styles/chat/chat.module.scss";

interface ChatMessageProps {
  type: "user" | "bot";
  content: string | Movie[];
}

export default function ChatMessage({ type, content }: ChatMessageProps) {
  const isUser = type === "user";

  return (
    <div
      className={styles.chat_message}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          backgroundColor: isUser ? "#007bff" : "#e0e0e0",
          color: isUser ? "white" : "black",
          borderRadius: "16px",
          padding: "10px 14px",
          maxWidth: "70%",
          whiteSpace: "pre-wrap",
        }}
      >
        {isUser && typeof content === "string" && <span> {content} </span>}
        {!isUser && typeof content === "object" && (
          <ul>
            {content.map((c, idx) => (
              <li key={idx}>{c.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
