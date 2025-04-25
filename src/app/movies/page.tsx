"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "../../styles/movies.module.css";
import MovieGridDisplay from "../components/GridMovieDisplay";
import CategoriesMovieDisplay from "../components/CategoriesMovieDisplay";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Chip } from "@mui/material";

type Categorie = {
  id: number;
  name: string;
};

export default function Movies() {
  const [viewMode, setViewMode] = useState<"grid" | "categories">("grid");
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id)
        ? prev.filter((genreId) => genreId !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const res = await fetch(`http://localhost:3001/movies/categories`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data = await res.json();

      data.sort((a: Categorie, b: Categorie) => {
        return a.id - b.id;
      });

      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    }
  };

  const PrettoSlider = styled(Slider)({
    color: "black",
    height: 8,
    "& .MuiSlider-track": {
      border: "none",
    },
    "& .MuiSlider-thumb": {
      height: 24,
      width: 24,
      backgroundColor: "#fff",
      border: "2px solid currentColor",
      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
        boxShadow: "inherit",
      },
      "&::before": {
        display: "none",
      },
    },
    "& .MuiSlider-valueLabel": {
      lineHeight: 1.2,
      fontSize: 12,
      background: "unset",
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: "50% 50% 50% 0",
      backgroundColor: "#52af77",
      transformOrigin: "bottom left",
      transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
      "&::before": { display: "none" },
      "&.MuiSlider-valueLabelOpen": {
        transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
      },
      "& > *": {
        transform: "rotate(45deg)",
      },
    },
  });

  return (
    <div className={styles.container}>
      <header className={styles.container_movies_title}>
        <h1>Movies 🎬</h1>
      </header>

      <section className={styles.container_movies_filters}>
        <div className={styles.movies_filters}>
          <div className={styles.container_filter_rate}>
            <div className={styles.slider_rate}>
              <Typography gutterBottom>Rates</Typography>
              <PrettoSlider
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                defaultValue={20}
              />
            </div>
          </div>

          <div className={styles.container_filters_genre}>
            {categories.map((categorie, index) => {
              const isSelected = selectedGenres.includes(categorie.id);
              return (
                <Chip key={`categorie_${index}`}
                  style={{margin: '0.2rem'}}
                  label={categorie.name}
                  onClick={() => toggleGenre(categorie.id)}
                  {...(isSelected && { onDelete: () => toggleGenre(categorie.id) })}
                />
              );
            })}
          </div>
        </div>
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
          <MovieGridDisplay active={viewMode === "grid"} genres={selectedGenres} />
        )}
        {viewMode === "categories" && (
          <CategoriesMovieDisplay active={viewMode === "categories"} />
        )}
      </main>
    </div>
  );
}
