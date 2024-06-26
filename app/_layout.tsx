import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import i18n from '../assets/localization/i18n';
import NetInfo from '@react-native-community/netinfo';
import React, { useCallback } from 'react';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { LANGUAGES, STORAGE_KEYS, THEMES } from '@/constants/common';
import { PaperProvider } from 'react-native-paper';
import { PreferencesContext } from './context/preference-context';
import { PushNotificationConfig } from './models/notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { UserData } from './models/user';
import NoInternetScreen from './resend-password copy';
export { ErrorBoundary } from 'expo-router';

export const initialRouteSettings = {
  initialRouteName: '(tabs)'
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

SplashScreen.preventAutoHideAsync();

export default function AppRootLayout() {
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

  return <AppAppNavigationLayout />;
}

function AppAppNavigationLayout() {
  const [isThemeDark, setIsThemeDark] = useState<boolean>(false);
  const [alertNotifications, setAlertNotifications] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>(LANGUAGES.ENGLISH);
  const [user, setUser] = useState<UserData | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  const updateFavouriteSpotId = useCallback((id: number) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      return { ...currentUser, favouriteSpotId: id };
    });
  }, []);

  const switchTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const switchAlertNotifications = React.useCallback(() => {
    return setAlertNotifications(!alertNotifications);
  }, [alertNotifications]);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);

        if (storedTheme !== null) {
          setIsThemeDark(storedTheme === THEMES.DARK);
        }

        const storedLanguage = await AsyncStorage.getItem(
          STORAGE_KEYS.LANGUAGE
        );

        if (storedLanguage !== null) {
          setLanguage(storedLanguage);
          i18n.changeLanguage(storedLanguage);
        }

        const storedNotificationsConfig = await AsyncStorage.getItem(
          STORAGE_KEYS.PUSH_NOTIFICATIONS_CONFIG
        );

        if (storedNotificationsConfig !== null) {
          const config: PushNotificationConfig = JSON.parse(
            storedNotificationsConfig
          );
          setAlertNotifications(config.enabled);
        }
      } catch (e) {}
    };

    const loadUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);

        if (userJson !== null) {
          const userData = JSON.parse(userJson);
          setUser(userData);
        }
      } catch (e) {}
    };
    
    loadPreferences();
    loadUserData();
  }, []);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  let paperTheme = isThemeDark ? darkTheme : lightTheme;
  let reactNavigationtheme = isThemeDark ? DarkTheme : DefaultTheme;
  const preferences = React.useMemo(
    () => ({
      switchTheme,
      isThemeDark,
      language,
      setLanguage,
      user,
      setUser,
      alertNotifications,
      switchAlertNotifications,
      updateFavouriteSpotId
    }),
    [
      switchTheme,
      isThemeDark,
      language,
      setLanguage,
      user,
      setUser,
      alertNotifications,
      switchAlertNotifications,
      updateFavouriteSpotId
    ]
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      <ThemeProvider value={reactNavigationtheme}>
        <PaperProvider theme={paperTheme}>
          <SafeAreaProvider
            style={{ backgroundColor: reactNavigationtheme.colors.background }}
          >
            {isConnected ? (
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false
                }}
              />
              <Stack.Screen
                name="registration"
                options={{
                  presentation: 'modal',
                  title: i18n.t('navigation.registration')
                }}
              />
              <Stack.Screen
                name="resend-password"
                options={{
                  presentation: 'modal',
                  title: i18n.t('navigation.resendPassword')
                }}
              />
              <Stack.Screen
                name="my-notifications"
                options={{
                  presentation: 'modal',
                  title: i18n.t('navigation.notifications')
                }}
              />
              <Stack.Screen
                name="about"
                options={{
                  presentation: 'modal',
                  title: i18n.t('navigation.about')
                }}
              />
            </Stack>
            ) : (
              <NoInternetScreen/>
            )}
          </SafeAreaProvider>
        </PaperProvider>
      </ThemeProvider>
    </PreferencesContext.Provider>
  );
}
