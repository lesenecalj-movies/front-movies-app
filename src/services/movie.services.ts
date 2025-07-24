import { MovieDetails } from "@/types/movie.types";
import { TmdbApiListResponse, TmdbApiMovieProvidersResponse } from "@/types/tmdb.types";

export async function discoverMovies(
  genres: number[],
  rate: number,
  page: number
): Promise<TmdbApiListResponse> {
  const genreParams = genres.length > 0 ? genres.join(",") : "";
  const res = await fetch(
    `http://localhost:3001/movies/discover?page=${page}&genres=${genreParams}&rate=${rate}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch movies: ${res.status}`);
  }

  return res.json();
}
export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const res = await fetch(`http://localhost:3001/movies/${movieId}`);
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

  return res.json();
}

export async function getMovieProviders(movieId: number): Promise<TmdbApiMovieProvidersResponse> {
  const res = await fetch(
    `http://localhost:3001/movies/${movieId}/providers`
  );
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

  return res.json();
}