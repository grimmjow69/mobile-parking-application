import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../assets/localization/i18n';
import {
  Button,
  HelperText,
  Snackbar,
  Text,
  TextInput,
  useTheme
  } from 'react-native-paper';
import { deletePushTokenFromServer, registerForPushNotificationsAsync, sendPushTokenToServer } from '../services/notifications-service';
import { Link } from 'expo-router';
import { loginUser } from '../services/auth-service';
import { PreferencesContext } from '../context/preference-context';
import { PushNotificationConfig } from '../models/notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { UserData } from '../models/user';

export default function ProfileScreen() {
  const { user, setUser } = useContext(PreferencesContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#56ae57');
  const { colors } = useTheme();

  const showSnackbar = (message: string, color = '#56ae57') => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };

  const handleLoginSuccess = async (userData: UserData) => {
    setUser(userData);

    try {
      const value = await AsyncStorage.getItem('pushNotificationsConfig');
      console.log(value);
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
    } catch (error) {
      console.error('Failed to clear user data', error);
    }
  };

  const handleLogin = async () => {
    await loginUser(email, password, showSnackbar, handleLoginSuccess);
  };

  const handleSignOut = async () => {
    try {
      if (user) {
        await deletePushTokenFromServer(user.userId);
        await AsyncStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to clear user data', error);
    }
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const isFormValid = () => {
    return validateEmail(email) && password.length >= 6;
  };

  const getIconColor = (hasError: boolean) => (hasError ? colors.error : colors.secondary);

  const emailError = email !== '' && !validateEmail(email);
  const passwordLengthError = password !== '' && password.length < 6;

  useEffect(() => {}, [user]);

  const onDismissSnackBar = () => setSnackbarVisible(false);

  const userContent = (
    <>
      <Button mode='contained' style={styles.buttonRow} onPress={() => console.log('')}>
        {i18n.t('profile.changePassword')}
      </Button>
      <Button mode='contained' style={styles.buttonRow} onPress={() => console.log('')}>
        {i18n.t('profile.changeEmail')}
      </Button>
      <Button style={styles.signOutButton} mode='contained' onPress={() => handleSignOut()}>
        {i18n.t('profile.signOut')}
      </Button>
    </>
  );

  const loginForm = (
    <>
      <TextInput
        label={i18n.t('profile.email')}
        value={email}
        onChangeText={setEmail}
        mode='outlined'
        error={emailError}
        style={styles.input}
        autoCapitalize='none'
        keyboardType='email-address'
        textContentType='emailAddress'
        right={<TextInput.Icon icon='email' color={getIconColor(emailError)} />}
      />
      <HelperText type='error' visible={emailError}>
        {i18n.t('profile.errors.emailError')}
      </HelperText>

      <TextInput
        label={i18n.t('profile.password')}
        value={password}
        onChangeText={setPassword}
        mode='outlined'
        error={passwordLengthError}
        style={styles.input}
        secureTextEntry
        textContentType='password'
        right={<TextInput.Icon icon='lock' color={getIconColor(passwordLengthError)} />}
      />
      <HelperText type='error' visible={passwordLengthError}>
        {i18n.t('profile.errors.passwordLengthError')}
      </HelperText>

      <Button
        mode='contained'
        onPress={handleLogin}
        style={styles.button}
        icon='login'
        disabled={!isFormValid()}
      >
        {i18n.t('profile.logIn')}
      </Button>

      <Link href='/resend-password' asChild>
        <Button style={styles.button}>{i18n.t('profile.forgotPassword')}</Button>
      </Link>

      <Text style={styles.registerText}>
        {i18n.t('profile.dontHaveAccount')} {'  '}
        <Link href='/registration' asChild>
          <Text style={styles.linkText} onPress={() => console.log('Navigate to registration')}>
            {i18n.t('profile.registerHere')}
          </Text>
        </Link>
      </Text>
    </>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.container}>{user ? userContent : loginForm}</View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        duration={Snackbar.DURATION_SHORT}
        style={{ backgroundColor: snackbarColor }}
      >
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>
          {' '}
          {snackbarMessage}
        </Text>
      </Snackbar>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16
  },
  input: {
    width: 240
  },
  button: {
    marginTop: 40
  },
  registerText: {
    marginTop: 16
  },
  linkText: {
    fontWeight: 'bold'
  },
  signOutButton: {
    position: 'absolute',
    bottom: 8
  },
  buttonRow: {
    marginBottom: 10,
    width: 200
  }
});
