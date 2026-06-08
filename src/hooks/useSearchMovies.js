import { useState, useCallback, useRef } from 'react';
import { useMovieContext } from '../context/MovieContext';
import { searchMovies, discoverMovies } from '../services/tmdbService';

export const useSearchMovies = () => {
  const { searchResults, setSearchResults, appendSearchResults, setLoading, setError, clearError } =
    useMovieContext();

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const debounceTimer = useRef(null);

  const performSearch = useCallback(
    async (searchQuery, genreId, year, pageNum) => {
      setLocalLoading(true);
      clearError();
      try {
        let response;
        let results = [];

        if (searchQuery.trim()) {
          response = await searchMovies(searchQuery, pageNum, year);
          results = response.results || [];
          if (genreId) {
            results = results.filter((m) => m.genre_ids?.includes(genreId));
          }
        } else if (genreId || year) {
          const params = { page: pageNum, sort_by: 'popularity.desc' };
          if (genreId) params.with_genres = genreId;
          if (year) params.primary_release_year = year;
          response = await discoverMovies(params);
          results = response.results || [];
        } else {
          setSearchResults([]);
          setPage(1);
          setTotalPages(1);
          setLocalLoading(false);
          return;
        }

        if (pageNum === 1) {
          setSearchResults(results);
        } else {
          appendSearchResults(results);
        }

        setQuery(searchQuery);
        setSelectedGenre(genreId);
        setSelectedYear(year);
        setPage(pageNum);
        setTotalPages(response?.total_pages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLocalLoading(false);
      }
    },
    [setSearchResults, appendSearchResults, setError, clearError]
  );

  const search = useCallback(
    (searchQuery, genreId = selectedGenre, year = selectedYear, pageNum = 1) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      if (pageNum > 1) {
        performSearch(searchQuery, genreId, year, pageNum);
        return;
      }

      debounceTimer.current = setTimeout(() => {
        performSearch(searchQuery, genreId, year, pageNum);
      }, 400);
    },
    [selectedGenre, selectedYear, performSearch]
  );

  const loadMore = useCallback(() => {
    if (!localLoading && page < totalPages) {
      search(query, selectedGenre, selectedYear, page + 1);
    }
  }, [localLoading, page, totalPages, query, selectedGenre, selectedYear, search]);

  const clearSearch = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSearchResults([]);
    setQuery('');
    setSelectedGenre(null);
    setSelectedYear(null);
    setPage(1);
    setTotalPages(1);
    clearError();
  }, [setSearchResults, clearError]);

  return {
    searchResults,
    loading: localLoading,
    query,
    selectedGenre,
    selectedYear,
    search,
    loadMore,
    clearSearch,
    hasMore: page < totalPages,
  };
};
