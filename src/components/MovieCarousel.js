import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import MovieCard from './MovieCard';
import { COLORS } from '../constants/colors';

// Section icon map
const SECTION_ICONS = {
  trending: { name: 'local-fire-department', color: '#FF6B35' },
  topRated: { name: 'star', color: '#F59E0B' },
  upcoming: { name: 'calendar-today', color: '#06B6D4' },
  popular: { name: 'trending-up', color: '#10B981' },
  nowPlaying: { name: 'movie', color: COLORS.primaryLight },
  default: { name: 'video-library', color: COLORS.primaryLight },
};

const AnimatedView = Animated.createAnimatedComponent(View);

const SectionHeader = ({ title, iconKey, onSeeAll }) => {
  const { name, color } = SECTION_ICONS[iconKey] || SECTION_ICONS.default;
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <View style={[styles.iconBox, { backgroundColor: color + '22' }]}>
          <Icon name={name} size={16} color={color} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {onSeeAll && (
        <TouchableOpacity style={styles.seeAll} onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See all</Text>
          <Icon name="chevron-right" size={15} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const MovieCarousel = ({ title, iconKey = 'default', movies, onPress, onSeeAll }) => {
  if (!movies || movies.length === 0) return null;

  const renderItem = useCallback(
    ({ item }) => <MovieCard movie={item} onPress={onPress} />,
    [onPress]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <SectionHeader title={title} iconKey={iconKey} onSeeAll={onSeeAll} />
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={5}
        maxToRenderPerBatch={6}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  seeAllText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
});

export default React.memo(MovieCarousel);
