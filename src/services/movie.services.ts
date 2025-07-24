import { TmdbApiResponse } from "@/types/tmdb.types";

export async function discoverMovies(
  genres: number[],
  rate: number,
  page: number
): Promise<TmdbApiResponse> {
  const genreParams = genres.length > 0 ? genres.join(",") : "";
  const res = await fetch(
    `http://localhost:3001/movies/discover?page=${page}&genres=${genreParams}&rate=${rate}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch movies: ${res.status}`);
  }

  return res.json();
}