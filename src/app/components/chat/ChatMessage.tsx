
import styles from "../../../styles/chat/chat.module.scss";

interface ChatMessageProps {
  type: "user" | "bot";
  content: string;
}

export default function ChatMessage({ type, content }: ChatMessageProps) {
  const isUser = type === "user";

  return (
    <div className={styles.chat_message} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
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
        
        {isUser && content}
        {!isUser && (
          <ul>
            <li>{content}</li>
          </ul>
        )}
      </div>
    </div>
  );
}