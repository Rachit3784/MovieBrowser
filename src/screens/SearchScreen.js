import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSearchMovies } from '../hooks/useSearchMovies';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import { COLORS } from '../constants/colors';
import { getGenres } from '../services/tmdbService';

const YEARS = ['All', ...Array.from({ length: 47 }, (_, i) => (2026 - i).toString())];

const SearchScreen = () => {
  const navigation = useNavigation();
  const {
    searchResults,
    loading,
    query,
    selectedGenre,
    selectedYear,
    search,
    loadMore,
    clearSearch,
    hasMore,
  } = useSearchMovies();

  const [searchText, setSearchText] = useState('');
  const [genres, setGenres] = useState([]);
  const [showGenreDD, setShowGenreDD] = useState(false);
  const [showYearDD, setShowYearDD] = useState(false);

  useEffect(() => {
    getGenres()
      .then((r) => setGenres(r.genres || []))
      .catch(() => { });
  }, []);

  const handleSearchChange = useCallback(
    (text) => {
      setSearchText(text);
      search(text, selectedGenre, selectedYear, 1);
    },
    [search, selectedGenre, selectedYear]
  );

  const handleClear = useCallback(() => {
    setSearchText('');
    clearSearch();
    setShowGenreDD(false);
    setShowYearDD(false);
  }, [clearSearch]);

  const handleMoviePress = useCallback(
    (movie) => navigation.navigate('MovieDetail', { movieId: movie.id }),
    [navigation]
  );

  const handleGenreSelect = useCallback(
    (genreId) => {
      setShowGenreDD(false);
      search(searchText, genreId, selectedYear, 1);
    },
    [search, searchText, selectedYear]
  );

  const handleYearSelect = useCallback(
    (year) => {
      setShowYearDD(false);
      search(searchText, selectedGenre, year, 1);
    },
    [search, searchText, selectedGenre]
  );

  const closeAll = () => {
    setShowGenreDD(false);
    setShowYearDD(false);
  };

  const activeGenreName = genres.find((g) => g.id === selectedGenre)?.name || 'Genre';
  const activeYear = selectedYear || 'Year';
  const hasFilters = selectedGenre || selectedYear;

  const renderMovieCard = ({ item }) => (
    <View style={styles.cardCell}>
      <MovieCard movie={item} onPress={handleMoviePress} />
    </View>
  );

  const renderFooter = () =>
    loading && searchResults.length > 0 ? (
      <ActivityIndicator color={COLORS.primary} style={styles.footerLoader} />
    ) : null;

  const renderEmpty = () => {
    if (loading) return null;
    if (!searchText && !hasFilters) {
      return (
        <EmptyState
          icon="search"
          title="Discover Movies"
          message="Search by title, or use Genre & Year filters to explore."
        />
      );
    }
    return (
      <EmptyState
        icon="movie-filter"
        title="No Results"
        message="Try a different keyword or adjust your filters."
        onRetry={() => search(searchText, selectedGenre, selectedYear, 1)}
      />
    );
  };

  return (
    <TouchableWithoutFeedback onPress={closeAll}>
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Icon name="search" size={20} color={COLORS.textTertiary} />
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={handleSearchChange}
              placeholder="Search movies..."
              placeholderTextColor={COLORS.textTertiary}
              returnKeyType="search"
              clearButtonMode="never"
            />
            {searchText || hasFilters ? (
              <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon name="close" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, selectedGenre && styles.filterChipActive]}
            onPress={() => { setShowGenreDD((v) => !v); setShowYearDD(false); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, selectedGenre && styles.filterChipTextActive]}>
              {activeGenreName}
            </Text>
            <Icon
              name={showGenreDD ? 'expand-less' : 'expand-more'}
              size={16}
              color={selectedGenre ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedYear && styles.filterChipActive]}
            onPress={() => { setShowYearDD((v) => !v); setShowGenreDD(false); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, selectedYear && styles.filterChipTextActive]}>
              {activeYear}
            </Text>
            <Icon
              name={showYearDD ? 'expand-less' : 'expand-more'}
              size={16}
              color={selectedYear ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>

          {hasFilters && (
            <TouchableOpacity
              style={styles.clearFilterBtn}
              onPress={() => { search(searchText, null, null, 1); }}
            >
              <Icon name="filter-alt-off" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Genre dropdown */}
        {showGenreDD && (
          <View style={[styles.dropdown, styles.dropdownLeft]}>
            <ScrollView
              style={styles.dropdownScroll}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              <TouchableOpacity
                style={[styles.ddItem, !selectedGenre && styles.ddItemActive]}
                onPress={() => handleGenreSelect(null)}
              >
                <Text style={[styles.ddItemText, !selectedGenre && styles.ddItemTextActive]}>
                  All Genres
                </Text>
              </TouchableOpacity>
              {genres.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  style={[styles.ddItem, selectedGenre === g.id && styles.ddItemActive]}
                  onPress={() => handleGenreSelect(g.id)}
                >
                  <Text style={[styles.ddItemText, selectedGenre === g.id && styles.ddItemTextActive]}>
                    {g.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Year dropdown */}
        {showYearDD && (
          <View style={[styles.dropdown, styles.dropdownRight]}>
            <ScrollView
              style={styles.dropdownScroll}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {YEARS.map((yr) => {
                const val = yr === 'All' ? null : yr;
                const isActive = selectedYear === val;
                return (
                  <TouchableOpacity
                    key={yr}
                    style={[styles.ddItem, isActive && styles.ddItemActive]}
                    onPress={() => handleYearSelect(val)}
                  >
                    <Text style={[styles.ddItemText, isActive && styles.ddItemTextActive]}>
                      {yr}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Results grid */}
        {loading && searchResults.length === 0 ? (
          <View style={styles.loaderCenter}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderMovieCard}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            numColumns={3}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onEndReached={hasMore ? loadMore : null}
            onEndReachedThreshold={0.4}
            maxToRenderPerBatch={9}
            windowSize={5}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    marginTop: 36,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,

    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  filterChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryGlow,
  },
  filterChipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  clearFilterBtn: {
    padding: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdown: {
    position: 'absolute',
    top: 108,
    width: 200,
    maxHeight: 260,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 100,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  dropdownLeft: { left: 16 },
  dropdownRight: { right: 16 },
  dropdownScroll: {
    maxHeight: 260,
  },
  ddItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  ddItemActive: {
    backgroundColor: COLORS.primaryGlow,
  },
  ddItemText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  ddItemTextActive: {
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 4,
  },
  cardCell: {
    flex: 1 / 3,
    alignItems: 'center',
    marginBottom: 16,
  },
  footerLoader: {
    marginVertical: 20,
  },
  loaderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});

export default React.memo(SearchScreen);
