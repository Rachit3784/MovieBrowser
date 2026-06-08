import { getImageUrl } from '../constants/endpoints';
import { COLORS } from '../constants/colors';

export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h === 0 ? `${m}m` : `${h}h ${m}m`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getYear = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear().toString();
};

export const formatRating = (rating) => {
  if (!rating || rating === 0) return 'NR';
  return rating.toFixed(1);
};

export const getRatingColor = (rating) => {
  if (!rating || rating === 0) return COLORS.textTertiary;
  if (rating >= 7.5) return COLORS.ratingHigh;
  if (rating >= 5.5) return COLORS.ratingMedium;
  return COLORS.ratingLow;
};

export const formatPopularity = (popularity) => {
  if (!popularity) return '0';
  if (popularity >= 1000) return `${(popularity / 1000).toFixed(1)}K`;
  return popularity.toFixed(0);
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
};

export const getPosterUrl = (path, size = 'medium') => {
  if (!path || typeof path !== 'string') return null;
  const url = getImageUrl(path, size, 'poster');
  return url;
};

export const getBackdropUrl = (path, size = 'medium') => {
  if (!path || typeof path !== 'string') return null;
  const url = getImageUrl(path, size, 'backdrop');
  return url;
};

export const findTrailer = (videos) => {
  if (!videos?.results?.length) return null;
  return (
    videos.results.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube' && v.official
    ) ||
    videos.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
    null
  );
};

export const extractYouTubeId = (key) => key || null;

export const getGenreNames = (genreIds, genres) => {
  if (!genreIds || !genres) return [];
  return genreIds
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter(Boolean);
};

export const formatVoteCount = (count) => {
  if (!count) return '0';
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};
