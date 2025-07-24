import Typography from "@mui/material/Typography";
import { Chip, styled } from "@mui/material";
import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";
import styles from "../../styles/movie.filter.module.scss";
import { MovieFiltersProps, Categorie } from "@/types/movie.types";

export default function MovieFilters(props: MovieFiltersProps) {
  const { genres, toggleGenre, rate, toggleRate } = props;
  const [categories, setCategories] = useState<Categorie[]>([]);

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
      backgroundColor: "black",
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
    <section className={styles.container_movies_filters}>
      <div className={styles.movies_filters}>
        <div className={styles.container_filter_rate}>
          <div className={styles.slider_rate}>
            <Typography gutterBottom>Rates</Typography>
            <PrettoSlider
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              defaultValue={rate}
              onChange={(event, newValue) => toggleRate(newValue as number)}
            />
          </div>
        </div>

        <div className={styles.container_filters_genre}>
          {categories.map((categorie, index) => {
            const isSelected = genres.includes(categorie.id);
            return (
              <Chip
                key={`categorie_${index}`}
                style={{ margin: "0.2rem" }}
                label={categorie.name}
                onClick={() => toggleGenre(categorie.id)}
                {...(isSelected && {
                  onDelete: () => toggleGenre(categorie.id),
                })}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
