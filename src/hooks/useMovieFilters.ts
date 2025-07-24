import { useState } from "react";

export function useMovieFilters() {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [rate, setRate] = useState<number>(50);

  const selectedGenresKey = selectedGenres.sort((a, b) => a - b).join(",");

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const toggleRate = (newRate: number) => {
    setRate(newRate);
  };

  return { selectedGenres, toggleGenre, rate, toggleRate, selectedGenresKey };
}