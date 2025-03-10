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
      <main>
        <h1>Movies 🎬</h1>
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
        {viewMode === "grid" && <MovieGridDisplay active={viewMode === "grid"} />}
        {viewMode === "categories" && <CategoriesMovieDisplay active={viewMode === "categories"} />}
      </main>
    </div>
  );
}
