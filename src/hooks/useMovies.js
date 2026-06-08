import { useState, useEffect, useCallback, useRef } from 'react';
import { useMovieContext } from '../context/MovieContext';
import {
  getTrendingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from '../services/tmdbService';
import { CacheService } from '../services/cacheService';

const CACHE_KEY = 'tmdb_home_movies';

export const useMovies = () => {
  const { trendingMovies, topRatedMovies, upcomingMovies, setHomeData, setError } =
    useMovieContext();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const hasFetched = useRef(false);

  // ─── Core fetch logic ───────────────────────────────────────────────────────
  const fetchMovies = useCallback(async (forceRefresh = false) => {
    // If data already in context and not forcing refresh, skip
    if (!forceRefresh && trendingMovies.length > 0) return;

    setLoading(true);
    try {
      // Check cache first (unless force-refreshing)
      if (!forceRefresh) {
        const cached = await CacheService.get(CACHE_KEY);
        if (cached) {
          setHomeData(cached.trending, cached.topRated, cached.upcoming);
          setLoading(false);
          return;
        }
      }

      // Live API fetch
      const [trending, topRated, upcoming] = await Promise.all([
        getTrendingMovies(),
        getTopRatedMovies(),
        getUpcomingMovies(),
      ]);

      const data = {
        trending: trending.results || [],
        topRated: topRated.results || [],
        upcoming: upcoming.results || [],
      };

      // Store in cache
      await CacheService.set(CACHE_KEY, data);

      setHomeData(data.trending, data.topRated, data.upcoming);
    } catch (err) {
      setError(err.message || 'Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [trendingMovies.length, setHomeData, setError]);

  // ─── Pull-to-refresh ────────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await CacheService.clear(CACHE_KEY);
    await fetchMovies(true);
    setRefreshing(false);
  }, [fetchMovies]);

  // ─── Load once on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchMovies(false);
    }
  }, []); // empty array → runs exactly once

  // ─── Featured movie (stable reference) ─────────────────────────────────────
  const featuredMovie = trendingMovies.length > 0 ? trendingMovies[0] : null;

  return {
    trendingMovies,
    topRatedMovies,
    upcomingMovies,
    featuredMovie,
    loading,
    refreshing,
    fetchMovies,
    onRefresh,
  };
};
