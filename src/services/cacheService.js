/**
 * AsyncStorage-backed cache utility.
 * TTL-based: data expires after CACHE_TTL milliseconds.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export const CacheService = {
  async get(key) {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      const { data, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp > CACHE_TTL) {
        await AsyncStorage.removeItem(key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  async set(key, data) {
    try {
      const payload = JSON.stringify({ data, timestamp: Date.now() });
      await AsyncStorage.setItem(key, payload);
    } catch {
      // silently fail - cache is best-effort
    }
  },

  async clear(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },

  async clearAll() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const movieKeys = keys.filter((k) => k.startsWith('tmdb_'));
      await AsyncStorage.multiRemove(movieKeys);
    } catch {}
  },
};
