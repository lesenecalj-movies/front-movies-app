import { CountryProviderByCountryCode, Movie, MovieDetails } from "@/types/movie.types";
import { BaseResponse, TmdbListResponse, TmdbResponse } from "@/types/tmdb.types";

const tmdbUrl = process.env.NEXT_PUBLIC_TMDB_API_URL;

export async function discoverMovies(
  genres: number[],
  rate: number,
  page: number
): Promise<TmdbListResponse<Movie>> {
  const genreParams = genres.length > 0 ? genres.join(",") : "";
  const res = await fetch(
    `${tmdbUrl}/movies/discover?page=${page}&genres=${genreParams}&rate=${rate}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch movies: ${res.status}`);
  }

  const { data } = await res.json() as BaseResponse<TmdbListResponse<Movie>>;
  return data;
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const res = await fetch(`${tmdbUrl}/movies/${movieId}`);
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  const { data } = await res.json() as BaseResponse<MovieDetails>;
  return data;
}

export async function getTrailerMovie(movieId: number): Promise<MovieDetails> {
  const res = await fetch(`${tmdbUrl}/movies/${movieId}`);
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  const { data } = await res.json() as BaseResponse<MovieDetails>;
  return data;
}

export async function getMovieProviders(movieId: number): Promise<TmdbResponse<CountryProviderByCountryCode>> {
  const res = await fetch(
    `${tmdbUrl}/movies/${movieId}/providers`
  );
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

  const { data } = await res.json() as BaseResponse<TmdbResponse<CountryProviderByCountryCode>>;
  return data;
}