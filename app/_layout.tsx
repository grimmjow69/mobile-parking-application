import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';

import { PaperProvider } from 'react-native-paper';
import React from 'react';
import { PreferencesContext } from './context/preference-context';
import Colors, { darkTheme, lightTheme } from '@/constants/Colors';
import i18n from '../assets/localization/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { UserData } from './models/user';

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
  const [isThemeDark, setIsThemeDark] = useState(false);
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState<UserData | null>(null);

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme !== null) {
          setIsThemeDark(storedTheme === 'dark');
        }

        const storedLanguage = await AsyncStorage.getItem('language');
        if (storedLanguage !== null) {
          setLanguage(storedLanguage);
          i18n.changeLanguage(storedLanguage);
        }
      } catch (e) {}
    };

    const loadUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson !== null) {
          const userData = JSON.parse(userJson);
          setUser(userData);
        }
      } catch (e) {
        console.error('Failed to load user data', e);
      }
    };

    loadPreferences();
    loadUserData();
  }, []);

  let paperTheme = isThemeDark ? darkTheme : lightTheme;
  let reactNavigationtheme = isThemeDark ? DarkTheme : DefaultTheme;

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
      language,
      setLanguage,
      user,
      setUser
    }),
    [toggleTheme, isThemeDark, language, setLanguage, user, setUser]
  );

  if (Platform.OS === 'android') {
    NavigationBar.setBackgroundColorAsync(Colors[isThemeDark ? 'dark' : 'light'].navigationBar);
  }

  return (
    <PreferencesContext.Provider value={preferences}>
      <ThemeProvider value={reactNavigationtheme}>
        <PaperProvider theme={paperTheme}>
          <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen
              name='notifications'
              options={{ presentation: 'modal', title: i18n.t('navigation.notifications') }}
            />
            <Stack.Screen
              name='registration'
              options={{ presentation: 'modal', title: i18n.t('navigation.registration') }}
            />
            <Stack.Screen
              name='resend-password'
              options={{ presentation: 'modal', title: i18n.t('navigation.resendPassword') }}
            />
          </Stack>
        </PaperProvider>
      </ThemeProvider>
    </PreferencesContext.Provider>
  );
}
