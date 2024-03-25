import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/assets/localization/i18n';
import React, { useContext, useState } from 'react';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { errorColor, successColor } from '@/constants/Colors';
import { Link } from 'expo-router';
import { loginUser } from '@/app/services/auth-service';
import { PreferencesContext, PreferencesContextProps } from '@/app/context/preference-context';
import { PushNotificationConfig } from '@/app/models/notifications';
import { registerForPushNotificationsAsync, sendPushTokenToServer } from '@/app/services/notifications-service';
import { StyleSheet, View } from 'react-native';
import { UserData } from '@/app/models/user';

interface LoginFormProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setSnackBarContent: (message: string, colorCode: string) => void;
    setSnackBarVisible: (visible: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loading,
  setLoading,
  setSnackBarContent,
  setSnackBarVisible
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { colors } = useTheme();
  const { setUser } = useContext<PreferencesContextProps>(PreferencesContext);

  async function handleLogin() {
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
      setSnackBarVisible(true);
      setLoading(false);
    }
  }

  async function handleLoginSuccess(userData: UserData) {
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
  }

  function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  function isFormValid() {
    return validateEmail(email) && password.length >= 6;
  }

  const getIconColor = (hasError: boolean) =>
    hasError ? colors.error : colors.outline;

  const emailError = email !== '' && !validateEmail(email);
  const passwordLengthError = password !== '' && password.length < 6;

  return (
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
        buttonColor={colors.secondary}
        labelStyle={{ color: colors.surfaceVariant }}
        style={{ marginTop: 10 }}
        icon="login-variant"
        disabled={!isFormValid()}
      >
        <Text variant="bodyLarge" style={{ color: colors.surfaceVariant }}>
          {i18n.t('profile.logIn')}
        </Text>
      </Button>

      <View style={styles.footerView}>
        <Link href="/resend-password" asChild>
          <Button
            icon={'emoticon-sad-outline'}
            buttonColor={colors.secondary}
            labelStyle={{ color: colors.surfaceVariant }}
          >
            <Text variant="bodyLarge" style={{ color: colors.surfaceVariant }}>
              {i18n.t('profile.forgotPassword')}
            </Text>
          </Button>
        </Link>

        <Text
          variant="bodyLarge"
          style={[styles.registerText, { color: colors.tertiary }]}
        >
          {i18n.t('profile.dontHaveAccount')} {'  '}
          <Link href="/registration" asChild>
            <Text
              variant="bodyLarge"
              style={{ color: colors.tertiary, fontWeight: 'bold' }}
            >
              {i18n.t('profile.registerHere')}
            </Text>
          </Link>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginForm: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60
  },
  input: {
    width: 240
  },
  registerText: {
    textAlign: 'center',
    marginTop: 16
  },
  footerView: {
    position: 'relative',
    top: 200
  },
  buttonRow: {
    marginBottom: 10,
    width: 200
  }
});

export default LoginForm;
