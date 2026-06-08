import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/colors';
import { getPosterUrl, formatRating, getRatingColor, getYear } from '../utils/helpers';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.55;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const MovieCard = ({ movie, onPress, cardWidth, cardHeight }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const scale = useSharedValue(1);

  const cw = cardWidth || CARD_WIDTH;
  const ch = cardHeight || CARD_HEIGHT;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const posterUrl = getPosterUrl(movie.poster_path, 'medium');
  const rating = formatRating(movie.vote_average);
  const ratingColor = getRatingColor(movie.vote_average);
  const year = getYear(movie.release_date || movie.first_air_date);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(!posterUrl);
  }, [movie.id, posterUrl]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (error) => {
    console.warn('Image load error:', error);
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <AnimatedTouchable
      style={[styles.container, { width: cw }, animStyle]}
      onPress={() => onPress && onPress(movie)}
      onPressIn={() => { scale.value = withSpring(0.94, { damping: 15, stiffness: 200 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 200 }); }}
      activeOpacity={1}
    >
      <View style={[styles.imageWrapper, { width: cw, height: ch }]}>
        {/* Placeholder while loading */}
        {!imageLoaded && !imageError && (
          <View style={styles.placeholder}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}

        {/* Error fallback */}
        {imageError && (
          <View style={styles.placeholder}>
            <Icon name="broken-image" size={28} color={COLORS.textMuted} />
          </View>
        )}

        {posterUrl && !imageError && (
          <Image
            source={{ uri: posterUrl }}
            style={[styles.poster, { opacity: imageLoaded ? 1 : 0.85 }]}
            resizeMode="cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Bottom gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(10,10,15,0.9)']}
          style={styles.cardGradient}
          pointerEvents="none"
        />

        {/* Rating */}
        {movie.vote_average > 0 && (
          <View style={[styles.ratingBadge, { borderColor: ratingColor + '55' }]}>
            <Icon name="star" size={8} color={ratingColor} />
            <Text style={[styles.ratingText, { color: ratingColor }]}>{rating}</Text>
          </View>
        )}
      </View>

      {/* Info below card */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title || movie.name || 'Unknown'}
        </Text>
        {year ? <Text style={styles.year}>{year}</Text> : null}
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  imageWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundTertiary,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundTertiary,
  },
  poster: {
    ...StyleSheet.absoluteFillObject,
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,15,0.88)',
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
    gap: 2,
  },
  ratingText: {
    fontSize: 9,
    fontWeight: '800',
  },
  info: {
    marginTop: 7,
    paddingHorizontal: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 15,
  },
  year: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
});

export default React.memo(MovieCard);
