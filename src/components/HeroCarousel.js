/**
 * JioCinema / Hotstar-style Hero Carousel
 * - Full-width auto-scrolling backdrop with pagination dots
 * - Animated slide transitions
 * - Blurred bottom gradient
 * - Genre tags, rating, Watch + Info buttons
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,

  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/colors';
import { getBackdropUrl, getPosterUrl, formatRating, getYear, truncateText, getGenreNames } from '../utils/helpers';

const { width, height } = Dimensions.get('window');
const BANNER_HEIGHT = height * 0.58;
const AUTO_SCROLL_INTERVAL = 5000;

// ─── Dot indicator ─────────────────────────────────────────────────────────
const Dot = ({ active }) => {
  const width_ = useSharedValue(active ? 22 : 6);
  const opacity_ = useSharedValue(active ? 1 : 0.4);

  useEffect(() => {
    width_.value = withSpring(active ? 22 : 6, { damping: 14, stiffness: 150 });
    opacity_.value = withTiming(active ? 1 : 0.4, { duration: 300 });
  }, [active]);

  const style = useAnimatedStyle(() => ({
    width: width_.value,
    opacity: opacity_.value,
  }));

  return <Animated.View style={[styles.dot, active && styles.dotActive, style]} />;
};

// ─── Single slide ───────────────────────────────────────────────────────────
const Slide = ({ movie, onWatch, onInfo, genres }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'large');
  const posterUrl = getPosterUrl(movie.poster_path, 'medium');
  const rating = formatRating(movie.vote_average);
  const year = getYear(movie.release_date);
  const genreNames = getGenreNames(movie.genre_ids, genres).slice(0, 3);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) });
    translateY.value = withSpring(0, { damping: 18, stiffness: 90 });
    setImgLoaded(false);
    setImgError(!backdropUrl);
  }, [movie.id, backdropUrl]);

  const contentAnim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleBackdropLoad = () => {
    setImgLoaded(true);
    setImgError(false);
  };

  const handleBackdropError = (error) => {
    console.warn('Backdrop load error:', error);
    setImgError(true);
    setImgLoaded(true);
  };

  return (
    <View style={styles.slide}>
      {/* Backdrop */}
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, { backgroundColor: COLORS.backgroundTertiary }]} />
      )}

      {/* Multi-layer gradient */}
      <LinearGradient
        colors={['rgba(10,10,15,0.05)', 'rgba(10,10,15,0.3)', 'rgba(10,10,15,0.82)', COLORS.background]}
        locations={[0, 0.3, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(10,10,15,0.55)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.7, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <Animated.View style={[styles.content, contentAnim]}>
        {/* Poster + Info row */}
        <View style={styles.mainRow}>
          {/* Poster */}
          <View style={styles.posterWrapper}>
            {posterUrl ? (
              <Image
                source={{ uri: posterUrl }}
                style={styles.poster}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.poster, { backgroundColor: COLORS.backgroundTertiary }]} />
            )}
            {/* Shine overlay */}
            <LinearGradient
              colors={['rgba(255,255,255,0.08)', 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </View>

          {/* Text info */}
          <View style={styles.textCol}>
            {/* LIVE badge */}
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>TRENDING</Text>
            </View>

            <Text style={styles.title} numberOfLines={2}>
              {movie.title || movie.name}
            </Text>

            {/* Meta row */}
            <View style={styles.metaRow}>
              {year ? <Text style={styles.metaText}>{year}</Text> : null}
              {year ? <View style={styles.metaDot} /> : null}
              {movie.vote_average > 0 && (
                <>
                  <Icon name="star" size={11} color="#F59E0B" />
                  <Text style={[styles.metaText, { color: '#F59E0B', marginLeft: 2 }]}>{rating}</Text>
                  <View style={styles.metaDot} />
                </>
              )}
              {movie.original_language ? (
                <Text style={styles.metaText}>{movie.original_language?.toUpperCase()}</Text>
              ) : null}
            </View>

            {/* Genre chips */}
            {genreNames.length > 0 && (
              <View style={styles.genreRow}>
                {genreNames.map((g, i) => (
                  <View key={i} style={styles.genreChip}>
                    <Text style={styles.genreText}>{g}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Overview */}
            <Text style={styles.overview} numberOfLines={3}>
              {truncateText(movie.overview, 110)}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.watchBtn}
            onPress={() => onWatch && onWatch(movie)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.watchBtnGrad}
            >
              <Icon name="play-arrow" size={20} color="#fff" />
              <Text style={styles.watchText}>Watch Trailer</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoBtn}
            onPress={() => onInfo && onInfo(movie)}
            activeOpacity={0.85}
          >
            <Icon name="add" size={18} color={COLORS.textPrimary} />
            <Text style={styles.infoText}>Watchlist</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() => onInfo && onInfo(movie)}
            activeOpacity={0.85}
          >
            <Icon name="info-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

// ─── Main Carousel ──────────────────────────────────────────────────────────
const HeroCarousel = ({ movies, onWatch, onInfo, genres }) => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoScrollTimer = useRef(null);
  const isScrolling = useRef(false);

  const startAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    autoScrollTimer.current = setInterval(() => {
      if (isScrolling.current || !movies?.length) return;
      const nextIndex = (activeIndex + 1) % movies.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, AUTO_SCROLL_INTERVAL);
  }, [activeIndex, movies?.length]);

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(autoScrollTimer.current);
  }, [startAutoScroll]);

  const onScrollBegin = useCallback(() => { isScrolling.current = true; }, []);
  const onScrollEnd = useCallback((e) => {
    isScrolling.current = false;
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(idx);
    clearInterval(autoScrollTimer.current);
    startAutoScroll();
  }, [startAutoScroll]);

  if (!movies?.length) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={movies}
        renderItem={({ item }) => (
          <Slide movie={item} onWatch={onWatch} onInfo={onInfo} genres={genres} />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={onScrollBegin}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews
      />

      {/* Pagination dots */}
      <View style={styles.dotsRow}>
        {movies.slice(0, 10).map((_, i) => (
          <Dot key={i} active={i === activeIndex} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: BANNER_HEIGHT,
  },
  slide: {
    width,
    height: BANNER_HEIGHT,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: 'absolute',
    bottom: 52,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
    marginBottom: 16,
  },
  posterWrapper: {
    width: 90,
    height: 132,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexShrink: 0,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  textCol: {
    flex: 1,
    gap: 6,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 27,
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.textTertiary,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  genreChip: {
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.4)',
  },
  genreText: {
    fontSize: 10,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  overview: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  watchBtn: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  watchBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 5,
  },
  watchText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  infoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    gap: 5,
  },
  infoText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  moreBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textSecondary,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
});

export default React.memo(HeroCarousel);
