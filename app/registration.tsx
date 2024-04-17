import Colors, { errorColor, successColor } from '@/constants/Colors';
import i18n from '../assets/localization/i18n';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { ActivityIndicator, Button, HelperText, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { PreferencesContext, PreferencesContextProps } from './context/preference-context';
import { registerNewUser } from './services/auth-service';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Keyboard } from 'react-native';

const EMAIL_REGEX = /\S+@\S+\.\S+/;
const MIN_PASSWORD_LENGTH = 6;

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarColor, setSnackbarColor] = useState<string>('');
  const { isThemeDark } =
    useContext<PreferencesContextProps>(PreferencesContext);

  const dismissSnackBar = () => setSnackbarVisible(false);

  const registerUser = async () => {
    try {
      setLoading(true);
      const result = await registerNewUser(email, password);
      setSnackBarContent(
        i18n.t(result.message),
        result.success ? successColor : errorColor
      );
      if (result.success) {
        Keyboard.dismiss();
        setTimeout(() => {
          navigation.goBack();
        }, 1);
      }
    } catch (err) {
      setSnackBarContent(i18n.t('base.error'), errorColor);
    } finally {
      setSnackbarVisible(true);
      setLoading(false);
    }
  };

  function setSnackBarContent(message: string, color: string) {
    setSnackbarColor(color);
    setSnackbarMessage(message);
  }

  const isEmailValid = (email: string) => {
    return EMAIL_REGEX.test(email);
  };

  const isRegistrationFormValid = () => {
    return (
      isEmailValid(email) &&
      password === passwordCheck &&
      password.length >= MIN_PASSWORD_LENGTH
    );
  };

  const { colors } = useTheme();

  const getIconColor = (hasError: boolean) =>
    hasError ? colors.error : colors.outline;

  const emailError = email !== '' && !isEmailValid(email);

  const passwordsMatchError =
    password !== '' && passwordCheck !== '' && password !== passwordCheck;

  const passwordLengthError =
    password !== '' && password.length < MIN_PASSWORD_LENGTH;

  return (
    <SafeAreaProvider style={styles.container}>
      <TextInput
        label={i18n.t('profile.email')}
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        error={emailError}
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

      <TextInput
        label={i18n.t('profile.passwordCheck')}
        value={passwordCheck}
        onChangeText={setPasswordCheck}
        mode="outlined"
        error={passwordsMatchError}
        style={styles.input}
        secureTextEntry
        textContentType="password"
        right={
          <TextInput.Icon
            icon="lock"
            color={getIconColor(passwordsMatchError)}
          />
        }
      />

      <HelperText type="error" visible={passwordsMatchError}>
        {i18n.t('profile.errors.passwordsMatchError')}
      </HelperText>

      <Button
        mode="contained"
        onPress={registerUser}
        buttonColor={colors.secondary}
        labelStyle={{ color: colors.surfaceVariant }}
        style={styles.button}
        icon="login-variant"
        disabled={!isRegistrationFormValid()}
      >
        <Text variant="bodyLarge" style={{ color: colors.surfaceVariant }}>
          {i18n.t('profile.register')}
        </Text>
      </Button>

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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  input: {
    width: 260
  },
  button: {
    marginTop: 20,
    marginBottom: 120
  }
});
