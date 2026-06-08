import Config from 'react-native-config';

// TMDB API Configuration
export const TMDB_CONFIG = {
  apiKey: Config.TMDB_API_KEY || '',
  baseUrl: Config.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  imageBaseUrl: Config.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
};

// Image sizes
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
  },
};

// TMDB Endpoints
export const ENDPOINTS = {
  trending: '/trending/movie/week',
  topRated: '/movie/top_rated',
  upcoming: '/movie/upcoming',
  popular: '/movie/popular',
  nowPlaying: '/movie/now_playing',
  search: '/search/movie',
  movieDetails: (id) => `/movie/${id}`,
  movieVideos: (id) => `/movie/${id}/videos`,
  movieCredits: (id) => `/movie/${id}/credits`,
  movieSimilar: (id) => `/movie/${id}/similar`,
  genres: '/genre/movie/list',
};

// Helper function to build full image URL
export const getImageUrl = (path, size = 'medium', type = 'poster') => {
  if (!path) return null;
  const imageSize = IMAGE_SIZES[type]?.[size] || IMAGE_SIZES.poster.medium;
  return `${TMDB_CONFIG.imageBaseUrl}/${imageSize}${path}`;
};
