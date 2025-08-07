export type Categorie = {
  id: number;
  name: string;
};

export type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
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