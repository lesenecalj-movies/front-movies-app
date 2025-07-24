import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from '../../styles/chat/chat.module.scss';

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (msg: string) => void;
  disabled?: boolean;

}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // focus on mount
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div
      className={styles.chat_input}
      style={{ display: "flex", gap: "8px", height: '100%', alignItems: 'center' }}
    >
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        style={{
          flex: 1,
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
        placeholder="Demande une suggestion de film..."
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        style={{
          backgroundColor: 'transparent',
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <Image src="/icons/send-message.png" alt="Send" width={24} height={24} />
      </button>
    </div>
  );
}
