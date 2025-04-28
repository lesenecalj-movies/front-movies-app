"use client";
import styles from "../../styles/movies.module.css";
import MovieGridDisplay from "../components/GridMovieDisplay";
import CategoriesMovieDisplay from "../components/CategoriesMovieDisplay";
import { useState } from "react";
import MovieFilters from "../components/MovieFilters";

export default function Movies() {
  const [viewMode, setViewMode] = useState<"grid" | "categories">("grid");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const toggleViewMode = (vm: string) => {
    setViewMode(vm === "grid" ? "categories" : "grid");
  };

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id)
        ? prev.filter((genreId) => genreId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.container_movies_title}>
        <h1>Movies 🎬</h1>
      </header>

      <MovieFilters
        genres={selectedGenres}
        toggleGenre={toggleGenre}
        toggleViewMode={toggleViewMode}
      />

      <main className={styles.container_movies_display}>
        {viewMode === "grid" && (
          <MovieGridDisplay
            active={viewMode === "grid"}
            genres={selectedGenres}
          />
        )}
        {viewMode === "categories" && (
          <CategoriesMovieDisplay active={viewMode === "categories"} />
        )}
      </main>
    </div>
  );
}
