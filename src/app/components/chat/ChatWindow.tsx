import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import styles from "../../../styles/chat/chat.module.scss";
import MovieCard from "../MovieCard";
import { Movie } from "../interfaces/movie.types";

export default function ChatWindow() {
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; content: string | Movie[] }[]
  >([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async (content: string) => {
    setMessages((prev) => [...prev, { type: "user", content }]);
    setIsStreaming(true);
    setSuggestedMovies([]);

    try {
      const res = await fetch(
        `http://localhost:3001/movies/suggestions?userRequest=${content}`
      );
      if (!res.ok)
        throw new Error("Erreur lors de la récupération des suggestions");
      const movies: Movie[] = await res.json();

      setSuggestedMovies(movies);
      setMessages((prev) => [...prev, { type: "bot", content: movies }]);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.container_chat_window}>
      <div className={styles.container_chat}>
        <div className={styles.inner_container_chat}>
          <div className={styles.container_chat_messages}>
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} type={msg.type} content={msg.content} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.container_chat_input}>
            <ChatInput onSend={sendMessage} disabled={isStreaming} />
          </div>
        </div>
      </div>
      <div className={styles.container_chat_response}>
        <div className={styles.container_suggested_movies}>
          {suggestedMovies &&
            suggestedMovies.length > 0 &&
            suggestedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
      </div>
    </div>
  );
}
