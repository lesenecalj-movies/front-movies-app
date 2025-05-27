import { useCallback, useEffect, useState } from "react";
import styles from "../../styles/movie.categories.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Movie } from "./interfaces/movie.types";

export default function CategoriesMovies({ active }: { active: boolean }) {
  const [discoverMovies, setDiscoverMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchDiscoverMovies();
  }, [active]);

  const FilmCarousel = ({ films }: { films:  Movie[]}) => {
    // Assurez-vous que le nombre de films par page est bien 10
    const slidesToShowPerPage = 10;

    const settings = {
      infinite: false, // Ne pas boucler à l'infini pour la pagination
      speed: 500,
      slidesToShow: slidesToShowPerPage,
      slidesToScroll: slidesToShowPerPage,
      arrows: true, // Afficher les flèches de navigation
      dots: false, // Ne pas afficher les points (on utilise des boutons)
      responsive: [
        {
          breakpoint: 1200, // Ajustez selon vos besoins
          settings: {
            slidesToShow: Math.min(6, slidesToShowPerPage),
            slidesToScroll: Math.min(6, slidesToShowPerPage),
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: Math.min(4, slidesToShowPerPage),
            slidesToScroll: Math.min(4, slidesToShowPerPage),
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(3, slidesToShowPerPage),
            slidesToScroll: Math.min(3, slidesToShowPerPage),
            arrows: false, // Masquer les flèches sur les petits écrans
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: Math.min(2, slidesToShowPerPage),
            slidesToScroll: Math.min(2, slidesToShowPerPage),
            arrows: false,
          },
        },
      ],
    };

    return (
      <div style={{ width: "100%", margin: "0 auto" }}>
        <Slider {...settings}>
          {films.map((film: Movie, index: number) => (
            <div key={index} style={{ padding: "0 10px" }}>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/original/${film.poster_path}`}
                  alt={film.title}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
                <div style={{ padding: "10px", textAlign: "center" }}>
                  <h3 style={{ fontSize: "1em", marginBottom: "5px" }}>
                    {film.title}
                  </h3>
                  <p style={{ fontSize: "0.9em", color: "#555" }}>
                    {film.popularity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  };

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
      {/* {discoverMovies.map((movie: Movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))} */}
      <FilmCarousel films={discoverMovies} />
    </div>
  );
}
