import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = (width * 9) / 16;

const TrailerPlayer = ({ videoId, onClose }) => {
  const [playing, setPlaying] = useState(true);

  if (!videoId) {
    return (
      <View style={styles.noVideo}>
        <Icon name="videocam-off" size={36} color={COLORS.textTertiary} />
        <Text style={styles.noVideoText}>Trailer not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <YoutubeIframe
        videoId={videoId}
        height={VIDEO_HEIGHT}
        width={width}
        play={playing}
        onChangeState={(event) => {
          if (event === 'ended') setPlaying(false);
        }}
      />

      {/* Controls overlay */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setPlaying((p) => !p)}
          activeOpacity={0.8}
        >
          <Icon name={playing ? 'pause' : 'play-arrow'} size={20} color="#fff" />
        </TouchableOpacity>

        {onClose && (
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom gradient label */}
      <LinearGradient
        colors={['transparent', 'rgba(10,10,15,0.7)']}
        style={styles.bottomLabel}
        pointerEvents="none"
      >
        <Icon name="smart-display" size={14} color={COLORS.primaryLight} />
        <Text style={styles.trailerLabel}>Official Trailer · YouTube</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  controls: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  controlBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  closeBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  bottomLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    paddingTop: 20,
    gap: 6,
  },
  trailerLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  noVideo: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noVideoText: {
    color: COLORS.textTertiary,
    fontSize: 13,
  },
});

export default React.memo(TrailerPlayer);
