import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react';

// ─── State ───────────────────────────────────────────────────────────────────
const initialState = {
  trendingMovies: [],
  topRatedMovies: [],
  upcomingMovies: [],
  searchResults: [],
  loading: false,
  error: null,
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
function movieReducer(state, action) {
  switch (action.type) {
    case 'SET_HOME_DATA':
      return {
        ...state,
        trendingMovies: action.payload.trending,
        topRatedMovies: action.payload.topRated,
        upcomingMovies: action.payload.upcoming,
        loading: false,
        error: null,
      };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload, loading: false, error: null };
    case 'APPEND_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: [...state.searchResults, ...action.payload],
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const MovieContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  // Stable dispatch-based actions (no new references on re-render)
  const setHomeData = useCallback((trending, topRated, upcoming) => {
    dispatch({ type: 'SET_HOME_DATA', payload: { trending, topRated, upcoming } });
  }, []);

  const setSearchResults = useCallback((results) => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  }, []);

  const appendSearchResults = useCallback((results) => {
    dispatch({ type: 'APPEND_SEARCH_RESULTS', payload: results });
  }, []);

  const setLoading = useCallback((val) => {
    dispatch({ type: 'SET_LOADING', payload: val });
  }, []);

  const setError = useCallback((msg) => {
    dispatch({ type: 'SET_ERROR', payload: msg });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Memoised value object - only changes when state changes
  const value = useMemo(
    () => ({
      ...state,
      setHomeData,
      setSearchResults,
      appendSearchResults,
      setLoading,
      setError,
      clearError,
    }),
    [state, setHomeData, setSearchResults, appendSearchResults, setLoading, setError, clearError]
  );

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useMovieContext = () => {
  const ctx = useContext(MovieContext);
  if (!ctx) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return ctx;
};
