import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import i18n from '../../assets/localization/i18n';
import ReportBug from '@/components/report-bug';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { ActivityIndicator, Button, Snackbar, Switch, Text, useTheme } from 'react-native-paper';
import { registerPushToken, getPushNotificationsToken, removePushToken } from '../services/notifications-service';
import { Link, useNavigation } from 'expo-router';
import { PreferencesContext, PreferencesContextProps } from '../context/preference-context';
import { PushNotificationConfig } from '../models/notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { LANGUAGES, STORAGE_KEYS, THEMES } from '@/constants/common';

export default function SettingsScreen() {
  const {
    switchTheme,
    isThemeDark,
    setLanguage,
    user,
    switchAlertNotifications,
    alertNotifications
  } = useContext<PreferencesContextProps>(PreferencesContext);
  const [isLanguageEnglish, setIsLanguageEnglish] = useState<boolean>(
    i18n.language === LANGUAGES.ENGLISH
  );
  const { colors } = useTheme();
  const [isReportBugVisible, setIsReportBugVisible] = useState<boolean>(false);
  const [snackBarVisible, setSnackBarVisible] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>('');
  const [snackBarColor, setSnackBarColor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();

  const dismissSnackBar = () => setSnackBarVisible(false);

  function setSnackBarContent(message: string, color: string) {
    setSnackBarColor(color);
    setSnackBarMessage(message);
  }

  const toggleLanguage = async () => {
    const newLanguage = isLanguageEnglish
      ? LANGUAGES.SLOVAK
      : LANGUAGES.ENGLISH;
    setIsLanguageEnglish(!isLanguageEnglish);
    i18n.changeLanguage(newLanguage);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, newLanguage);
    setLanguage(newLanguage);
  };

  const toggleDarkTheme = async () => {
    switchTheme();
    const newTheme = isThemeDark ? THEMES.LIGHT : THEMES.DARK;
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  };

  const toggleReportBugModal = () => {
    setIsReportBugVisible(!isReportBugVisible);
  };

  useEffect(() => {
    const blurListener = navigation.addListener('blur', () => {
      setIsReportBugVisible(false);
    });
    return blurListener;
  }, [navigation]);

  const toggleAlert = async () => {
    switchAlertNotifications();
    const pushNotificationsConfig: PushNotificationConfig = {
      enabled: !alertNotifications
    };
    await AsyncStorage.setItem(
      STORAGE_KEYS.PUSH_NOTIFICATIONS_CONFIG,
      JSON.stringify(pushNotificationsConfig)
    );

    try {
      if (pushNotificationsConfig.enabled) {
        await getPushNotificationsToken().then((token) => {
          if (token) {
            registerPushToken(token, user!.userId);
          }
        });
      } else {
        await removePushToken(user!.userId);
      }
    } catch (error) {}
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.content}>
        <View style={styles.switchRow}>
          <Text
            variant="bodyLarge"
            style={{
              color: colors.tertiary
            }}
          >
            {i18n.t('settings.darkTheme')}
          </Text>
          <Switch value={isThemeDark} onValueChange={toggleDarkTheme} />
        </View>

        <View style={styles.switchRow}>
          <Text
            variant="bodyLarge"
            style={{
              color: colors.tertiary
            }}
          >
            {i18n.t('settings.useEnglish')}
          </Text>
          <Switch value={isLanguageEnglish} onValueChange={toggleLanguage} />
        </View>

        {user && (
          <View style={styles.switchRow}>
            <Text
              variant="bodyLarge"
              style={{
                color: colors.tertiary
              }}
            >
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
              labelStyle={{
                color: colors.surfaceVariant
              }}
              icon="information"
              mode="contained"
            >
              <Text
                variant="bodyLarge"
                style={{
                  color: colors.surfaceVariant
                }}
              >
                {i18n.t('navigation.about')}
              </Text>
            </Button>
          </Link>

          <Button
            buttonColor={colors.secondary}
            labelStyle={{
              color: colors.surfaceVariant
            }}
            icon="bug"
            mode="contained"
            style={[styles.reportButton, styles.footerButton]}
            onPress={() => toggleReportBugModal()}
          >
            <Text
              variant="bodyLarge"
              style={{
                color: colors.surfaceVariant
              }}
            >
              {i18n.t('settings.reportBug')}
            </Text>
          </Button>
          <Text
            variant="labelMedium"
            style={{
              color: colors.tertiary
            }}
          >
            {i18n.t('settings.author')}: Lukáš Fuček
          </Text>
          <Text
            variant="labelMedium"
            style={{
              color: colors.tertiary
            }}
          >
            {i18n.t('settings.version')}: 1.0.0
          </Text>
        </View>
      </View>
      <ReportBug
        visible={isReportBugVisible}
        onDismiss={toggleReportBugModal}
        setLoading={setLoading}
        setSnackBarContent={setSnackBarContent}
        setSnackBarVisible={setSnackBarVisible}
      />
      <SpinnerOverlay
        textContent={i18n.t('base.wait')}
        textStyle={
          isThemeDark
            ? {
                color: '#fff'
              }
            : {
                color: '#303c64'
              }
        }
        animation="fade"
        visible={loading}
        overlayColor={Colors[isThemeDark ? 'dark' : 'light'].spinnerOverlay}
        customIndicator={
          <ActivityIndicator
            size="large"
            color={Colors[isThemeDark ? 'dark' : 'light'].spinnerColor}
          />
        }
      />
      <Snackbar
        visible={snackBarVisible}
        onDismiss={dismissSnackBar}
        duration={1000}
        style={{
          backgroundColor: snackBarColor
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fff'
          }}
        >
          {' '}
          {snackBarMessage}
        </Text>
      </Snackbar>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
