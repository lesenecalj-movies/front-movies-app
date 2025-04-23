"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "../../styles/movies.module.css";
import MovieGridDisplay from "../components/GridMovieDisplay";
import CategoriesMovieDisplay from "../components/CategoriesMovieDisplay";

export default function Movies() {
  const [viewMode, setViewMode] = useState<"grid" | "categories">("grid");

  return (
    <div className={styles.container}>
      <header className={styles.container_movies_title}>
        <h1>Movies 🎬</h1>
      </header>

      <section className={styles.container_movies_filters}>
        <div className={styles.display}>
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
      </section>

      <main className={styles.container_movies_display}>
        {viewMode === "grid" && (
          <MovieGridDisplay active={viewMode === "grid"} />
        )}
        {viewMode === "categories" && (
          <CategoriesMovieDisplay active={viewMode === "categories"} />
        )}
      </main>
    </div>
  );
}
