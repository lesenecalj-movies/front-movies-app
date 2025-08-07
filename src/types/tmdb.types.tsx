export type BaseResponse<T> = {
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
};

export type TmdbResponse<T> = {
  id: number;
  results: T[];
};

export type TmdbListResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type TmdbMovieProvidersResponse = {
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
