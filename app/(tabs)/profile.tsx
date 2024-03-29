import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import i18n from '../../assets/localization/i18n';
import LoginForm from '@/components/login-form';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import UserContent from '@/components/user-content';
import { ActivityIndicator, Snackbar, Text } from 'react-native-paper';
import { PreferencesContext, PreferencesContextProps } from '../context/preference-context';
import { removePushToken } from '../services/notifications-service';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useContext, useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { STORAGE_KEYS } from '@/constants/common';

export default function ProfileScreen() {
  const { user, isThemeDark, setUser } =
    useContext<PreferencesContextProps>(PreferencesContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarColor, setSnackbarColor] = useState<string>('');
  const [isChangeEmailVisible, setIsChangeEmailVisible] =
    useState<boolean>(false);
  const [isChangePasswordVisible, setIsChangePasswordVisible] =
    useState<boolean>(false);

  const navigation = useNavigation();

  function setSnackBarContent(message: string, color: string) {
    setSnackbarColor(color);
    setSnackbarMessage(message);
  }

  function toggleChangeEmailModal() {
    setIsChangeEmailVisible(!isChangeEmailVisible);
  }

  function toggleChangePasswordModal() {
    setIsChangePasswordVisible(!isChangePasswordVisible);
  }

  async function handleSignOut() {
    try {
      if (user) {
        setLoading(true);
        await removePushToken(user.userId);
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
        setUser(null);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const blurListener = navigation.addListener('blur', () => {
      setIsChangeEmailVisible(false);
      setIsChangePasswordVisible(false);
    });

    return blurListener;
  }, [navigation]);

  useEffect(() => {}, [user]);

  const dismissSnackBar = () => setSnackbarVisible(false);

  return (
    <SafeAreaProvider>
      {user ? (
        <UserContent
          handleSignOut={handleSignOut}
          isChangeEmailVisible={isChangeEmailVisible}
          isChangePasswordVisible={isChangePasswordVisible}
          toggleChangeEmailModal={toggleChangeEmailModal}
          toggleChangePasswordModal={toggleChangePasswordModal}
          setLoading={setLoading}
          setSnackBarContent={setSnackBarContent}
          setSnackBarVisible={setSnackbarVisible}
        />
      ) : (
        <LoginForm
          loading={loading}
          setLoading={setLoading}
          setSnackBarContent={setSnackBarContent}
          setSnackBarVisible={setSnackbarVisible}
        />
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={dismissSnackBar}
        duration={Snackbar.DURATION_SHORT}
        style={{
          backgroundColor: snackbarColor
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
          {snackbarMessage}
        </Text>
      </Snackbar>

      <SpinnerOverlay
        textContent={i18n.t('base.wait')}
        textStyle={isThemeDark ? { color: '#fff' } : { color: '#303c64' }}
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
    </SafeAreaProvider>
  );
}
