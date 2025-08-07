import { Movie } from "@/types/movie.types";
import { BaseResponse, TmdbListResponse, TmdbMovieProvidersResponse } from "@/types/tmdb.types";

export async function discoverMovies(
  genres: number[],
  rate: number,
  page: number
): Promise<TmdbListResponse<Movie>> {
  const genreParams = genres.length > 0 ? genres.join(",") : "";
  const res = await fetch(
    `http://localhost:3001/movies/discover?page=${page}&genres=${genreParams}&rate=${rate}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch movies: ${res.status}`);
  }

  const { data } = await res.json() as BaseResponse<TmdbListResponse<Movie>>;
  return data;
}

export async function getMovieDetails(movieId: number): Promise<Movie> {
  const res = await fetch(`http://localhost:3001/movies/${movieId}`);
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  const { data } = await res.json() as BaseResponse<Movie>;
  return data;
}

export async function getMovieProviders(movieId: number): Promise<TmdbMovieProvidersResponse> {
  const res = await fetch(
    `http://localhost:3001/movies/${movieId}/providers`
  );
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

  const { data } = await res.json() as BaseResponse<TmdbMovieProvidersResponse>;
  return data;
}