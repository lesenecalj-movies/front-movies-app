import { discoverMovies } from '@/services/movie.services';
import { TmdbApiListResponse } from '@/types/tmdb.types';
import { useQuery } from '@tanstack/react-query';


interface UseDiscoverMoviesParams {
  genres: number[];
  rate: number;
  page: number;
}

export function useDiscoverMovies({ genres, rate, page }: UseDiscoverMoviesParams) {
  return useQuery<TmdbApiListResponse, Error, TmdbApiListResponse>({
    queryKey: ['discoverMovies', genres.sort(), rate, page],
    queryFn: () => discoverMovies(genres, rate, page),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
}