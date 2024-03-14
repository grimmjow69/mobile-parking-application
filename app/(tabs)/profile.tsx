import AsyncStorage from '@react-native-async-storage/async-storage';
import ChangeEmail from '@/components/change-email';
import ChangePassword from '@/components/change-password';
import Colors, { errorColor, successColor } from '@/constants/Colors';
import i18n from '../../assets/localization/i18n';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, HelperText, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { deletePushTokenFromServer, registerForPushNotificationsAsync, sendPushTokenToServer } from '../services/notifications-service';
import { Link, useNavigation } from 'expo-router';
import { loginUser } from '../services/auth-service';
import { PreferencesContext, PreferencesContextProps } from '../context/preference-context';
import { PushNotificationConfig } from '../models/notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useContext, useEffect, useState } from 'react';
import { UserData } from '../models/user';
import { useIsFocused } from '@react-navigation/native';

export default function ProfileScreen() {
  const { user, isThemeDark, setUser } =
    useContext<PreferencesContextProps>(PreferencesContext);
  const { colors } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarColor, setSnackbarColor] = useState<string>('');
  const [isChangeEmailVisible, setIsChangeEmailVisible] =
    useState<boolean>(false);
  const [isChangePasswordVisible, setIsChangePasswordVisible] =
    useState<boolean>(false);
    
  const navigation = useNavigation();

  const handleLoginSuccess = async (userData: UserData) => {
    setUser(userData);
    try {
      const value = await AsyncStorage.getItem('pushNotificationsConfig');
      if (value !== null) {
        const config: PushNotificationConfig = JSON.parse(value);

        if (config.enabled) {
          await registerForPushNotificationsAsync().then((token) => {
            if (token) {
              sendPushTokenToServer(token, userData.userId);
            }
          });
        }
      } else {
        await registerForPushNotificationsAsync().then((token) => {
          if (token) {
            sendPushTokenToServer(token, userData.userId);
          }
        });
      }
      const userJson = JSON.stringify(userData);
      await AsyncStorage.setItem('user', userJson);
    } catch (error) {}
  };

  function setSnackBarContent(message: string, color: string) {
    setSnackbarColor(color);
    setSnackbarMessage(message);
  }

  const toggleChangeEmailModal = () => {
    setIsChangeEmailVisible(!isChangeEmailVisible);
  };

  const toggleChangePasswordModal = () => {
    setIsChangePasswordVisible(!isChangePasswordVisible);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await loginUser(email, password);
      setSnackBarContent(
        i18n.t(result.message),
        result.success ? successColor : errorColor
      );

      if (result.success && result.user) {
        handleLoginSuccess(result.user);
      }
    } catch (error) {
      setSnackBarContent(i18n.t('base.error'), errorColor);
    } finally {
      setSnackbarVisible(true);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (user) {
        setLoading(true);
        await deletePushTokenFromServer(user.userId);
        await AsyncStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const isFormValid = () => {
    return validateEmail(email) && password.length >= 6;
  };

  const getIconColor = (hasError: boolean) =>
    hasError ? colors.error : colors.secondary;

  const emailError = email !== '' && !validateEmail(email);
  const passwordLengthError = password !== '' && password.length < 6;

  useEffect(() => {
    const blurListener = navigation.addListener('blur', () => {
      setIsChangeEmailVisible(false);
      setIsChangePasswordVisible(false);
    });

    return blurListener;
  }, [navigation]);

  useEffect(() => {}, [user]);

  const onDismissSnackBar = () => setSnackbarVisible(false);

  const userContent = (
    <View style={styles.userContent}>
      <Button
        mode="contained"
        style={styles.buttonRow}
        onPress={() => toggleChangePasswordModal()}
      >
        {i18n.t('profile.changePassword')}
      </Button>
      <Button
        mode="contained"
        style={styles.buttonRow}
        onPress={() => toggleChangeEmailModal()}
      >
        {i18n.t('profile.changeEmail')}
      </Button>
      <Link href="/my-notifications" asChild>
        <Button style={styles.buttonRow} mode="contained">
          {i18n.t('profile.myNotifications')}
        </Button>
      </Link>
      <Button
        style={styles.signOutButton}
        mode="contained"
        onPress={() => handleSignOut()}
      >
        {i18n.t('profile.signOut')}
      </Button>
      <ChangeEmail
        visible={isChangeEmailVisible}
        onDismiss={toggleChangeEmailModal}
      />
      <ChangePassword
        visible={isChangePasswordVisible}
        onDismiss={toggleChangePasswordModal}
      />
    </View>
  );

  const loginForm = (
    <View style={styles.loginForm}>
      <TextInput
        label={i18n.t('profile.email')}
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        error={emailError}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        right={<TextInput.Icon icon="email" color={getIconColor(emailError)} />}
      />
      <HelperText type="error" visible={emailError}>
        {i18n.t('profile.errors.emailError')}
      </HelperText>

      <TextInput
        label={i18n.t('profile.password')}
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        error={passwordLengthError}
        style={styles.input}
        secureTextEntry
        textContentType="password"
        right={
          <TextInput.Icon
            icon="lock"
            color={getIconColor(passwordLengthError)}
          />
        }
      />
      <HelperText type="error" visible={passwordLengthError}>
        {i18n.t('profile.errors.passwordLengthError')}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        icon="login"
        disabled={!isFormValid()}
      >
        {i18n.t('profile.logIn')}
      </Button>

      <Link href="/resend-password" asChild>
        <Button style={styles.button}>
          {i18n.t('profile.forgotPassword')}
        </Button>
      </Link>

      <Text style={styles.registerText}>
        {i18n.t('profile.dontHaveAccount')} {'  '}
        <Link href="/registration" asChild>
          <Text
            style={styles.linkText}
            onPress={() => console.log('Navigate to registration')}
          >
            {i18n.t('profile.registerHere')}
          </Text>
        </Link>
      </Text>
    </View>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      {user ? userContent : loginForm}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
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

const styles = StyleSheet.create({
  container: {
    // paddingTop: 60
  },
  userContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48
  },
  loginForm: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48
  },
  input: {
    width: 240
  },
  button: {
    marginTop: 40
  },
  registerText: {
    textAlign: 'center',
    marginTop: 16
  },
  linkText: {
    fontWeight: 'bold'
  },
  signOutButton: {
    position: 'absolute',
    bottom: 48
  },
  buttonRow: {
    marginBottom: 10,
    width: 200
  }
});
