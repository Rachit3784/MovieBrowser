import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MovieProvider } from './src/context/MovieContext';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <MovieProvider>
        <RootNavigator />
      </MovieProvider>
    </SafeAreaProvider>
  );
};

export default App;
