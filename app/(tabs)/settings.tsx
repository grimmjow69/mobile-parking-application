import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../assets/localization/i18n';
import React, { useContext, useState } from 'react';
import { Button, Switch, Text } from 'react-native-paper';
import { deletePushTokenFromServer, registerForPushNotificationsAsync, sendPushTokenToServer } from '../services/notifications-service';
import { PreferencesContext } from '../context/preference-context';
import { PushNotificationConfig } from '../models/notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
  const {
    toggleTheme,
    isThemeDark,
    setLanguage,
    user,
    toggleAlertNotifications,
    alertNotifications
  } = useContext(PreferencesContext);
  const [isLanguageEnglish, setIsLanguageEnglish] = useState(i18n.language === 'en');

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

    await AsyncStorage.setItem('pushNotificationsConfig', JSON.stringify(pushNotificationsConfig));
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
    } catch (error) {
      console.error('Failed when setting up notifications', error);
    }
  };

  const reportBug = () => {
    console.log('Bug report button tapped');
  };

  return (
    <View style={styles.container}>
      <SafeAreaProvider style={styles.container}>
        <View style={styles.content}>
          <View style={styles.switchRow}>
            <Text>{i18n.t('settings.darkTheme')}</Text>
            <Switch value={isThemeDark} onValueChange={toggleDarkTheme} />
          </View>

          <View style={styles.switchRow}>
            <Text>{i18n.t('settings.useEnglish')}</Text>
            <Switch value={isLanguageEnglish} onValueChange={toggleLanguage} />
          </View>

          {user && (
            <View style={styles.switchRow}>
              <Text>{i18n.t('settings.alertPushNotifications')}</Text>
              <Switch value={alertNotifications} onValueChange={toggleAlert} />
            </View>
          )}

          <View style={styles.footer}>
            <Button icon='bug' mode='contained' style={styles.reportButton} onPress={reportBug}>
              {i18n.t('settings.reportBug')}
            </Button>
            <Text>{i18n.t('settings.author')}: Lukáš Fuček</Text>
            <Text>{i18n.t('settings.version')}: 1.0.0</Text>
          </View>
        </View>
      </SafeAreaProvider>
    </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 100
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
