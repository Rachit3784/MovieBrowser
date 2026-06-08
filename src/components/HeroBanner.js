import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/colors';
import { getBackdropUrl, truncateText, formatRating, getYear } from '../utils/helpers';

const { width, height } = Dimensions.get('window');
const BANNER_HEIGHT = height * 0.62;

const HeroBanner = ({ movie, onPress, onMoviePress }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(1.05);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    translateY.value = withDelay(200, withSpring(0, { damping: 18, stiffness: 90 }));
    scale.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) });
  }, [movie?.id]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const imgStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!movie) return null;

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'large');
  const rating = formatRating(movie.vote_average);
  const year = getYear(movie.release_date);

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[StyleSheet.absoluteFill, imgStyle]}>
        <Image
          source={{ uri: backdropUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Gradient overlay */}
      <LinearGradient
        colors={['rgba(10,10,15,0.1)', 'rgba(10,10,15,0.5)', 'rgba(10,10,15,0.95)', COLORS.background]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Side gradient */}
      <LinearGradient
        colors={['rgba(10,10,15,0.6)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.content, contentStyle]}>
        {/* Badges */}
        <View style={styles.badgeRow}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>TRENDING</Text>
          </View>
          {year ? (
            <View style={styles.yearBadge}>
              <Text style={styles.yearBadgeText}>{year}</Text>
            </View>
          ) : null}
          {movie.vote_average > 0 && (
            <View style={styles.ratingBadge}>
              <Icon name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingBadgeText}>{rating}</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {movie.title || movie.name}
        </Text>

        {/* Overview */}
        <Text style={styles.overview}>
          {truncateText(movie.overview, 120)}
        </Text>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.watchButton}
            onPress={() => onPress && onPress(movie)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.primary, COLORS.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.watchButtonGradient}
            >
              <Icon name="play-arrow" size={22} color="#fff" />
              <Text style={styles.watchButtonText}>Watch Trailer</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => onMoviePress && onMoviePress(movie)}
            activeOpacity={0.85}
          >
            <Icon name="info-outline" size={20} color={COLORS.textPrimary} />
            <Text style={styles.infoButtonText}>More Info</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: BANNER_HEIGHT,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundSecondary,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  liveBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  yearBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  yearBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
    gap: 3,
  },
  ratingBadgeText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 10,
    lineHeight: 36,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  overview: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 19,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  watchButton: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  watchButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 6,
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    gap: 6,
  },
  infoButtonText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default React.memo(HeroBanner);
