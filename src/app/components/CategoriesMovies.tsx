import { useCallback, useEffect, useState } from "react";
import styles from "../../styles/movie.categories.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Movie } from "./interfaces/movie.types";
import NetflixCarousel from "./Carousel";

export default function CategoriesMovies({ active }: { active: boolean }) {
  const [discoverMovies, setDiscoverMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchDiscoverMovies();
  }, [active]);


  const fetchDiscoverMovies = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/movies/trending");
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data: {
        page: number;
        results: Movie[];
        total_pages: number;
        total_results: number;
      } = await res.json();
      setDiscoverMovies(() => {
        const sortedMovies = data.results.sort((a, b) => {
          return b.popularity - a.popularity;
        });
        return sortedMovies;
      });
    } catch (error) {
      console.error("Error fetching discover movies:", error);
    }
  }, []);

  return (
    <div className={styles.container_categories_movies}>
      <NetflixCarousel movies={discoverMovies} />
    </div>
  );
}
