import { Movie } from "./movie.types";

export type TmdbApiListResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type TmdbApiMovieProvidersResponse = {
  id: number;
  results: {
    [countryCode: string]: CountryProviderData;
  };
};

export type ProviderOption = {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
};

export type CountryProviderData = {
  link: string;
  rent?: ProviderOption[];
  buy?: ProviderOption[];
  flatrate?: ProviderOption[];
};
