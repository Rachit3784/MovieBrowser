import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useMovies } from '../hooks/useMovies';
import HeroCarousel from '../components/HeroCarousel';
import MovieCarousel from '../components/MovieCarousel';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import { COLORS } from '../constants/colors';
import { getGenres } from '../services/tmdbService';
import { CacheService } from '../services/cacheService';

const GENRE_CACHE_KEY = 'tmdb_genres';

const HomeScreen = ({ navigation }) => {
  const {
    trendingMovies,
    topRatedMovies,
    upcomingMovies,
    loading,
    refreshing,
    onRefresh,
  } = useMovies();

  const [genres, setGenres] = useState([]);

  // Load genres once (needed for HeroCarousel genre chips)
  useEffect(() => {
    const loadGenres = async () => {
      const cached = await CacheService.get(GENRE_CACHE_KEY);
      if (cached) { setGenres(cached); return; }
      try {
        const res = await getGenres();
        const list = res.genres || [];
        setGenres(list);
        await CacheService.set(GENRE_CACHE_KEY, list);
      } catch {}
    };
    loadGenres();
  }, []);

  const goToDetail = useCallback(
    (movie) => navigation.navigate('MovieDetail', { movieId: movie.id }),
    [navigation]
  );

  const goToTrailer = useCallback(
    (movie) => navigation.navigate('MovieDetail', { movieId: movie.id, autoPlayTrailer: true }),
    [navigation]
  );

  if (loading && trendingMovies.length === 0) return <LoadingScreen />;

  if (!loading && trendingMovies.length === 0) {
    return (
      <EmptyState
        icon="wifi-off"
        title="No Connection"
        message="Please check your internet and pull down to refresh."
        onRetry={onRefresh}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
            progressBackgroundColor={COLORS.backgroundSecondary}
          />
        }
      >
        {/* JioCinema-style hero carousel */}
        <HeroCarousel
          movies={trendingMovies.slice(0, 8)}
          genres={genres}
          onWatch={goToTrailer}
          onInfo={goToDetail}
        />

        {/* Content rows */}
        <View style={styles.sections}>
          <MovieCarousel
            title="Trending Now"
            iconKey="trending"
            movies={trendingMovies}
            onPress={goToDetail}
            onSeeAll={() => navigation.navigate('Search', { filterCategory: 'trending' })}
          />
          <MovieCarousel
            title="Top Rated"
            iconKey="topRated"
            movies={topRatedMovies}
            onPress={goToDetail}
            onSeeAll={() => navigation.navigate('Search', { filterCategory: 'topRated' })}
          />
          <MovieCarousel
            title="Coming Soon"
            iconKey="upcoming"
            movies={upcomingMovies}
            onPress={goToDetail}
            onSeeAll={() => navigation.navigate('Search', { filterCategory: 'upcoming' })}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  sections: {
    paddingTop: 24,
    paddingBottom: 30,
  },
});

export default HomeScreen;
