// components/ChatWindow.tsx
import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import styles from "../../../styles/chat/chat.module.scss";
import MovieCard from "../MovieCard";

type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; content: string }[]
  >([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([]);

  const sendMessage = async (content: string) => {
    setMessages((prev) => [...prev, { type: "user", content }]);
    setIsStreaming(true);
    setSuggestedMovies([]);

    const eventSource = new EventSource(
      `http://localhost:3001/movies/suggestions?userRequest=${content}`
    );
    let botMessage = "";

    eventSource.onmessage = (event) => {
      if (event.data === "[END]") {
        eventSource.close();
        setIsStreaming(false);
        setMessages((prev) => [...prev, { type: "bot", content: botMessage }]);
      } else {
        const movie = JSON.parse(event.data);
        botMessage += movie.title;

        setSuggestedMovies((prev) => {
          return [...prev, movie];
        });

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.type === "bot") {
            return [...prev.slice(0, -1), { ...last, content: botMessage }];
          } else {
            return [...prev, { type: "bot", content: botMessage }];
          }
        });
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsStreaming(false);
    };
  };

  return (
    <div
      className={styles.container_chat_window}
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <div className={styles.container_chat_messages}>
        <div className={styles.chat_messages}>
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} type={msg.type} content={msg.content} />
          ))}
        </div>
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
      <div className={styles.container_chat_response}>
        <div className={styles.container_suggested_movies}>
          {suggestedMovies &&
            suggestedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
      </div>
    </div>
  );
}
