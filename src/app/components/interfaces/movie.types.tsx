export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  popularity: number;
  vote_average: number;
};

export type MovieDetails = {
  runtime: number;
  genres: [{ id: number; name: string }];
};

export type MovieProvider = {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
};

export interface MovieProps {
  movie: Movie;
  lastMovieRef?: (node: HTMLDivElement | null) => void; // Optional ref for infinite scrolling
}

export type Categorie = {
  id: number;
  name: string;
};

export interface MovieFiltersProps {
  genres: number[];
  toggleGenre: (id: number) => void;
  toggleViewMode: (viewMode: string) => void;
}