"use client";
import styles from "../../styles/movies.module.scss";
import GridMovies from "../../components/movies/GridMovies";
import Image from "next/image";
import { useState } from "react";
import ChatWindow from "@/components/chats/ChatWindow";
import CategoriesMovies from "@/components/movies/CategoriesMovies";

export default function Movies() {
  const [viewMode, setViewMode] = useState<"search" | "grid" | "categories">("grid");

  return (
    <div className={styles.container}>
      <header className={styles.container_movies_title}>
        <h1>Movies 🎬</h1>
      </header>

      <main className={styles.container_movies_display}>
        <div className={styles.display}>
          <button onClick={() => setViewMode("search")}>
          <Image src="/icons/search.png" alt="Grille" width={24} height={24} />
          </button>
          <button onClick={() => setViewMode("grid")}>
            <Image src="/icons/grid.png" alt="Grille" width={24} height={24} />
          </button>
          <button onClick={() => setViewMode("categories")}>
            <Image
              src="/icons/menu.png"
              alt="Catégories"
              width={24}
              height={24}
            />
          </button>
        </div>

        {viewMode === "search" && <ChatWindow />}
        {viewMode === "grid" && <GridMovies active={viewMode === "grid"} />}
        {viewMode === "categories" && (
          <CategoriesMovies active={viewMode === "categories"} />
        )}
      </main>
    </div>
  );
}
