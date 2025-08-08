// CATEGORIES

export type Categorie = {
  id: number;
  name: string;
};

// MOVIES

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

export type TmdbVideoMovie = {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
};

export type MovieDetails = {
  runtime: number;
  genres: [{ id: number; name: string }];
};

// MOVIE PROVIDERS

export type MovieProvider = {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
};

export type CountryProviderByCountryCode = {
  [countryCode: string]: CountryProvider;
};

export type CountryProvider = {
  link: string;
  rent?: MovieProvider[];
  buy?: MovieProvider[];
  flatrate?: MovieProvider[];
};
