import { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Navigation from './app/navigation';
import { LogBox } from 'react-native';

// Suppress the InteractionManager deprecation warning
// This warning usually comes from React Navigation and other older third-party libs
LogBox.ignoreLogs([
  'InteractionManager has been deprecated',
]);

// Prevent auto-hiding the splash screen so fonts can load
SplashScreen.preventAutoHideAsync().catch(() => {});

function App() {
  const navigationRef = useRef<any>(null);

  const [loaded, error] = useFonts({
    'DMSans-Regular': require('./assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('./assets/fonts/DMSans-Medium.ttf'),
    'DMSans-SemiBold': require('./assets/fonts/DMSans-SemiBold.ttf'),
    'DMSans-Bold': require('./assets/fonts/DMSans-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} theme={DarkTheme}>
        <Navigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
