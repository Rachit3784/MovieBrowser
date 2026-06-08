import api from './api';
import { ENDPOINTS } from '../constants/endpoints';

export const getTrendingMovies = async (page = 1) => {
  const res = await api.get(ENDPOINTS.trending, { params: { page } });
  return res.data;
};

export const getTopRatedMovies = async (page = 1) => {
  const res = await api.get(ENDPOINTS.topRated, { params: { page } });
  return res.data;
};

export const getUpcomingMovies = async (page = 1) => {
  const res = await api.get(ENDPOINTS.upcoming, { params: { page } });
  return res.data;
};

export const getPopularMovies = async (page = 1) => {
  const res = await api.get(ENDPOINTS.popular, { params: { page } });
  return res.data;
};

export const searchMovies = async (query, page = 1, year = null) => {
  const params = { query, page };
  if (year) {
    params.primary_release_year = year;
  }
  const res = await api.get(ENDPOINTS.search, { params });
  return res.data;
};

export const getMovieDetails = async (movieId) => {
  const res = await api.get(ENDPOINTS.movieDetails(movieId));
  return res.data;
};

export const getMovieVideos = async (movieId) => {
  const res = await api.get(ENDPOINTS.movieVideos(movieId));
  return res.data;
};

export const getMovieCredits = async (movieId) => {
  const res = await api.get(ENDPOINTS.movieCredits(movieId));
  return res.data;
};

export const getSimilarMovies = async (movieId) => {
  const res = await api.get(ENDPOINTS.movieSimilar(movieId));
  return res.data;
};

export const getGenres = async () => {
  const res = await api.get(ENDPOINTS.genres);
  return res.data;
};

export const discoverMovies = async (params) => {
  const res = await api.get('/discover/movie', { params });
  return res.data;
};
