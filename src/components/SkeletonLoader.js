import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

export const SkeletonPlaceholder = ({ width: w, height: h, borderRadius = 4, style }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.placeholder,
        {
          width: w,
          height: h,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const SkeletonCard = () => {
  const cardWidth = width * 0.3;
  const cardHeight = cardWidth * 1.5;

  return (
    <View style={styles.cardContainer}>
      <SkeletonPlaceholder width={cardWidth} height={cardHeight} borderRadius={8} />
      <View style={styles.cardTextContainer}>
        <SkeletonPlaceholder width={cardWidth * 0.8} height={14} borderRadius={4} />
      </View>
    </View>
  );
};

export const SkeletonCarousel = () => {
  const dummyData = [1, 2, 3, 4, 5];
  return (
    <View style={styles.carouselContainer}>
      <SkeletonPlaceholder
        width={120}
        height={20}
        borderRadius={4}
        style={styles.carouselTitle}
      />
      <FlatList
        data={dummyData}
        renderItem={() => <SkeletonCard />}
        keyExtractor={(item) => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
      />
    </View>
  );
};

export const SkeletonBanner = () => {
  return (
    <View style={styles.bannerContainer}>
      <SkeletonPlaceholder width={width} height={height * 0.6} borderRadius={0} />
      <View style={styles.bannerContent}>
        <SkeletonPlaceholder width={width * 0.6} height={28} borderRadius={4} style={styles.mb} />
        <SkeletonPlaceholder width={width * 0.8} height={16} borderRadius={4} style={styles.mb} />
        <SkeletonPlaceholder width={width * 0.5} height={16} borderRadius={4} style={styles.mb} />
        <SkeletonPlaceholder width={120} height={40} borderRadius={8} style={styles.watchButton} />
      </View>
    </View>
  );
};

export const SkeletonGrid = () => {
  const dummyData = Array.from({ length: 9 }, (_, i) => i);
  return (
    <View style={styles.gridContainer}>
      <FlatList
        data={dummyData}
        renderItem={() => (
          <View style={styles.gridItem}>
            <SkeletonCard />
          </View>
        )}
        keyExtractor={(item) => item.toString()}
        numColumns={3}
        contentContainerStyle={styles.gridContent}
      />
    </View>
  );
};

export const SkeletonDetail = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder width={width} height={250} borderRadius={0} />
      <View style={styles.detailContent}>
        <View style={styles.detailHeader}>
          <SkeletonPlaceholder width={120} height={180} borderRadius={12} />
          <View style={styles.detailHeaderInfo}>
            <SkeletonPlaceholder width={width * 0.5} height={24} borderRadius={4} style={styles.mb} />
            <SkeletonPlaceholder width={width * 0.3} height={16} borderRadius={4} style={styles.mb} />
            <SkeletonPlaceholder width={width * 0.4} height={16} borderRadius={4} style={styles.mb} />
            <SkeletonPlaceholder width={120} height={36} borderRadius={8} style={styles.watchButton} />
          </View>
        </View>
        <View style={styles.section}>
          <SkeletonPlaceholder width={100} height={20} borderRadius={4} style={styles.mb} />
          <SkeletonPlaceholder width={width - 40} height={16} borderRadius={4} style={styles.mb} />
          <SkeletonPlaceholder width={width - 40} height={16} borderRadius={4} style={styles.mb} />
          <SkeletonPlaceholder width={width * 0.7} height={16} borderRadius={4} style={styles.mb} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  placeholder: {
    backgroundColor: COLORS.backgroundTertiary,
  },
  cardContainer: {
    marginRight: 12,
  },
  cardTextContainer: {
    marginTop: 8,
  },
  carouselContainer: {
    marginBottom: 24,
  },
  carouselTitle: {
    marginLeft: 16,
    marginBottom: 12,
  },
  carouselContent: {
    paddingHorizontal: 16,
  },
  bannerContainer: {
    width,
    height: height * 0.6,
    backgroundColor: COLORS.backgroundSecondary,
  },
  bannerContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  mb: {
    marginBottom: 12,
  },
  watchButton: {
    marginTop: 8,
  },
  gridContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  gridContent: {
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  detailContent: {
    marginTop: -100,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  detailHeaderInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
});
