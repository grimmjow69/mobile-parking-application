import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { PaperProvider } from 'react-native-paper';
import React from 'react';
import { PreferencesContext } from './context/preference-context';
import { darkTheme, lightTheme } from '@/constants/Colors';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)'
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [isThemeDark, setIsThemeDark] = React.useState(false);

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  let paperTheme = isThemeDark ? darkTheme : lightTheme;
  let reactNavigationtheme = isThemeDark ? DarkTheme : DefaultTheme;

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark
    }),
    [toggleTheme, isThemeDark]
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      <ThemeProvider value={reactNavigationtheme}>
        <PaperProvider theme={paperTheme}>
          <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen
              name='notifications'
              options={{ presentation: 'modal', title: 'Notifications' }}
            />
            <Stack.Screen
              name='registration'
              options={{ presentation: 'modal', title: 'Register' }}
            />
            <Stack.Screen
              name='resend-password'
              options={{ presentation: 'modal', title: 'Resend password' }}
            />
          </Stack>
        </PaperProvider>
      </ThemeProvider>
    </PreferencesContext.Provider>
  );
}
