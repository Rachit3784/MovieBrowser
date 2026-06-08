import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  getMovieDetails,
  getMovieVideos,
  getSimilarMovies,
} from '../services/tmdbService';
import TrailerPlayer from '../components/TrailerPlayer';
import EmptyState from '../components/EmptyState';
import LoadingScreen from '../components/LoadingScreen';
import { COLORS } from '../constants/colors';
import {
  getPosterUrl,
  getBackdropUrl,
  formatRuntime,
  formatDate,
  formatRating,
  getRatingColor,
  findTrailer,
  extractYouTubeId,
  formatVoteCount,
} from '../utils/helpers';

const { width } = Dimensions.get('window');
const BACKDROP_HEIGHT = 280;

const MovieDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { movieId, autoPlayTrailer = false } = route.params;

  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const loadDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [movieData, videosData, similarData] = await Promise.all([
        getMovieDetails(movieId),
        getMovieVideos(movieId),
        getSimilarMovies(movieId),
      ]);
      setMovie(movieData);
      setVideos(videosData);
      setSimilarMovies(similarData?.results?.slice(0, 10) || []);
      if (autoPlayTrailer) setShowTrailer(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [movieId, autoPlayTrailer]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  if (loading) return <LoadingScreen />;
  if (error || !movie) {
    return (
      <EmptyState
        icon="error-outline"
        title="Oops!"
        message={error || 'Failed to load movie details.'}
        onRetry={loadDetails}
      />
    );
  }

  const posterUrl = getPosterUrl(movie.poster_path, 'large');
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'large');
  const rating = formatRating(movie.vote_average);
  const ratingColor = getRatingColor(movie.vote_average);
  const trailer = findTrailer(videos);
  const trailerVideoId = trailer ? extractYouTubeId(trailer.key) : null;

  const StatChip = ({ icon, label, value }) => (
    <View style={styles.statChip}>
      <Icon name={icon} size={14} color={COLORS.primary} />
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Backdrop */}
        <View style={styles.backdropContainer}>
          <Image
            source={{ uri: backdropUrl }}
            style={styles.backdrop}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(10,10,15,0.2)', 'rgba(10,10,15,0.6)', COLORS.background]}
            style={StyleSheet.absoluteFill}
          />

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <View style={styles.backBtnInner}>
              <Icon name="arrow-back" size={22} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Main content card */}
        <View style={styles.content}>
          {/* Header row: poster + info */}
          <View style={styles.headerRow}>
            <View style={styles.posterWrapper}>
              <Image
                source={{ uri: posterUrl }}
                style={styles.poster}
                resizeMode="cover"
              />
              {/* Rating overlay on poster */}
              <View style={[styles.ratingPill, { backgroundColor: ratingColor + '22', borderColor: ratingColor + '60' }]}>
                <Icon name="star" size={12} color={ratingColor} />
                <Text style={[styles.ratingPillText, { color: ratingColor }]}>{rating}</Text>
              </View>
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.title}>{movie.title}</Text>

              {movie.tagline ? (
                <Text style={styles.tagline}>"{movie.tagline}"</Text>
              ) : null}

              <Text style={styles.releaseDate}>{formatDate(movie.release_date)}</Text>

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <View style={styles.genreRow}>
                  {movie.genres.slice(0, 3).map((g) => (
                    <View key={g.id} style={styles.genreChip}>
                      <Text style={styles.genreText}>{g.name}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <StatChip icon="star" label="Rating" value={`${rating} / 10`} />
            <StatChip icon="schedule" label="Runtime" value={formatRuntime(movie.runtime)} />
            <StatChip icon="group" label="Votes" value={formatVoteCount(movie.vote_count)} />
          </View>

          {/* Action Buttons */}
          {trailerVideoId && !showTrailer && (
            <TouchableOpacity
              style={styles.trailerBtn}
              onPress={() => setShowTrailer(true)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[COLORS.primaryLight, COLORS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.trailerBtnGradient}
              >
                <Icon name="play-arrow" size={24} color="#fff" />
                <Text style={styles.trailerBtnText}>Watch Trailer</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Trailer Player */}
          {showTrailer && trailerVideoId && (
            <View style={styles.playerWrapper}>
              <TrailerPlayer
                videoId={trailerVideoId}
                onClose={() => setShowTrailer(false)}
              />
            </View>
          )}

          {!trailerVideoId && (
            <View style={styles.noTrailerNotice}>
              <Icon name="videocam-off" size={18} color={COLORS.textTertiary} />
              <Text style={styles.noTrailerText}>No trailer available</Text>
            </View>
          )}

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview || 'No description available.'}</Text>
          </View>

          {/* Production companies */}
          {movie.production_companies?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Production</Text>
              <View style={styles.tagRow}>
                {movie.production_companies.map((c) => (
                  <View key={c.id} style={styles.productionTag}>
                    <Text style={styles.productionTagText}>{c.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Languages */}
          {movie.spoken_languages?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <Text style={styles.langText}>
                {movie.spoken_languages.map((l) => l.english_name).join(' · ')}
              </Text>
            </View>
          )}

          {/* Similar movies */}
          {similarMovies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>More Like This</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {similarMovies.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={styles.similarCard}
                    onPress={() =>
                      navigation.replace('MovieDetail', { movieId: m.id })
                    }
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{
                        uri: getPosterUrl(m.poster_path, 'small') || '',
                      }}
                      style={styles.similarPoster}
                      resizeMode="cover"
                    />
                    <Text style={styles.similarTitle} numberOfLines={2}>
                      {m.title}
                    </Text>
                    <View style={styles.similarRating}>
                      <Icon name="star" size={10} color="#F59E0B" />
                      <Text style={styles.similarRatingText}>{formatRating(m.vote_average)}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  backdropContainer: {
    width,
    height: BACKDROP_HEIGHT,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
  },
  backBtnInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10,10,15,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  content: {
    marginTop: -30,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  posterWrapper: {
    position: 'relative',
  },
  poster: {
    width: 110,
    height: 165,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundTertiary,
  },
  ratingPill: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    transform: [{ translateX: -24 }],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    gap: 3,
    backgroundColor: 'rgba(10,10,15,0.85)',
  },
  ratingPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  tagline: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  releaseDate: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  genreChip: {
    backgroundColor: COLORS.primaryGlow,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  genreText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statChip: {
    alignItems: 'center',
    gap: 6,
    flexDirection: 'column',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: 4,
  },
  statValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  trailerBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  trailerBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  trailerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  playerWrapper: {
    marginBottom: 20,
    borderRadius: 14,
    overflow: 'hidden',
  },
  noTrailerNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noTrailerText: {
    color: COLORS.textTertiary,
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  overview: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  productionTag: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productionTagText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  langText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  similarCard: {
    width: 100,
    marginRight: 10,
  },
  similarPoster: {
    width: 100,
    height: 150,
    borderRadius: 10,
    backgroundColor: COLORS.backgroundTertiary,
  },
  similarTitle: {
    fontSize: 11,
    color: COLORS.textPrimary,
    marginTop: 6,
    lineHeight: 15,
  },
  similarRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 2,
  },
  similarRatingText: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '700',
  },
});

export default React.memo(MovieDetailScreen);
