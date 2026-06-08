import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

const ShimmerBlock = ({ width: w = '100%', height: h = 16, borderRadius = 8, style }) => {
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.linear }),
        withTiming(0, { duration: 900, easing: Easing.linear })
      ),
      -1
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + shimmer.value * 0.4,
  }));

  return (
    <Animated.View
      style={[{ width: w, height: h, borderRadius, backgroundColor: COLORS.backgroundTertiary }, style, animStyle]}
    />
  );
};

const LoadingScreen = () => (
  <View style={styles.container}>
    {/* Hero placeholder */}
    <ShimmerBlock height={360} borderRadius={0} />
    <View style={styles.content}>
      {[1, 2].map((section) => (
        <View key={section} style={styles.section}>
          <ShimmerBlock width={160} height={22} />
          <View style={styles.row}>
            {[1, 2, 3].map((card) => (
              <View key={card} style={styles.card}>
                <ShimmerBlock width={(width - 64) / 3} height={((width - 64) / 3) * 1.52} />
                <ShimmerBlock width={(width - 64) / 3 - 4} height={12} style={{ marginTop: 8 }} />
                <ShimmerBlock width={40} height={10} style={{ marginTop: 4 }} />
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    gap: 0,
  },
});

export default LoadingScreen;
