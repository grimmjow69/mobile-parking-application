import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../assets/localization/i18n';
import { Button, Switch, Text, useTheme } from 'react-native-paper';
import { deletePushTokenFromServer, registerForPushNotificationsAsync, sendPushTokenToServer } from '../services/notifications-service';
import { Link } from 'expo-router';
import { PreferencesContext, PreferencesContextProps } from '../context/preference-context';
import { PushNotificationConfig } from '../models/notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { useContext, useState } from 'react';

export default function SettingsScreen() {
  const {
    toggleTheme,
    isThemeDark,
    setLanguage,
    user,
    toggleAlertNotifications,
    alertNotifications
  } = useContext<PreferencesContextProps>(PreferencesContext);
  const [isLanguageEnglish, setIsLanguageEnglish] = useState<boolean>(
    i18n.language === 'en'
  );

  const { colors } = useTheme();

  const toggleLanguage = async () => {
    const newLanguage = isLanguageEnglish ? 'sk' : 'en';
    setIsLanguageEnglish(!isLanguageEnglish);
    i18n.changeLanguage(newLanguage);
    await AsyncStorage.setItem('language', newLanguage);
    setLanguage(newLanguage);
  };

  const toggleDarkTheme = async () => {
    toggleTheme();
    const newTheme = isThemeDark ? 'light' : 'dark';
    await AsyncStorage.setItem('theme', newTheme);
  };

  const toggleAlert = async () => {
    toggleAlertNotifications();
    const pushNotificationsConfig: PushNotificationConfig = {
      enabled: !alertNotifications
    };
    await AsyncStorage.setItem(
      'pushNotificationsConfig',
      JSON.stringify(pushNotificationsConfig)
    );

    try {
      if (pushNotificationsConfig.enabled) {
        await registerForPushNotificationsAsync().then((token) => {
          if (token) {
            sendPushTokenToServer(token, user!.userId);
          }
        });
      } else {
        await deletePushTokenFromServer(user!.userId);
      }
    } catch (error) {}
  };

  const reportBug = () => {
    console.log('Bug report button tapped');
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.content}>
        <View style={styles.switchRow}>
          <Text variant="bodyLarge" style={{ color: colors.tertiary }}>
            {i18n.t('settings.darkTheme')}
          </Text>
          <Switch value={isThemeDark} onValueChange={toggleDarkTheme} />
        </View>

        <View style={styles.switchRow}>
          <Text variant="bodyLarge" style={{ color: colors.tertiary }}>
            {i18n.t('settings.useEnglish')}
          </Text>
          <Switch value={isLanguageEnglish} onValueChange={toggleLanguage} />
        </View>

        {user && (
          <View style={styles.switchRow}>
            <Text variant="bodyLarge" style={{ color: colors.tertiary }}>
              {i18n.t('settings.alertPushNotifications')}
            </Text>
            <Switch value={alertNotifications} onValueChange={toggleAlert} />
          </View>
        )}

        <View style={styles.footer}>
          <Link
            href="/about"
            asChild
            style={[styles.aboutButton, styles.footerButton]}
          >
            <Button
              buttonColor={colors.secondary}
              labelStyle={{ color: colors.surfaceVariant }}
              icon="information"
              mode="contained"
              onPress={reportBug}
            >
              <Text
                variant="bodyLarge"
                style={{ color: colors.surfaceVariant }}
              >
                {i18n.t('navigation.about')}
              </Text>
            </Button>
          </Link>

          <Button
            buttonColor={colors.secondary}
            labelStyle={{ color: colors.surfaceVariant }}
            icon="bug"
            mode="contained"
            style={[styles.reportButton, styles.footerButton]}
            onPress={reportBug}
          >
            <Text variant="bodyLarge" style={{ color: colors.surfaceVariant }}>
              {i18n.t('settings.reportBug')}
            </Text>
          </Button>
          <Text variant="labelMedium" style={{ color: colors.tertiary }}>
            {i18n.t('settings.author')}: Lukáš Fuček
          </Text>
          <Text variant="labelMedium" style={{ color: colors.tertiary }}>
            {i18n.t('settings.version')}: 1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  },
  footerButton: {
    width: 220
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 80
  },
  aboutButton: {
    marginBottom: 12
  },
  reportButton: {
    marginBottom: 30
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center'
  }
});
