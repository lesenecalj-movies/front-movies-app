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
