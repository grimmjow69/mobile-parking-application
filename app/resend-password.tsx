import Colors, { errorColor, successColor } from '@/constants/Colors';
import i18n from '../assets/localization/i18n';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { ActivityIndicator, Button, HelperText, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { PreferencesContext, PreferencesContextProps } from './context/preference-context';
import { ReportCategory, ReportRequest } from './models/report';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { submitUserReport } from './services/report-service';
import { StyleSheet } from 'react-native';
import { useContext, useState } from 'react';

const EMAIL_REGEX = /\S+@\S+\.\S+/;

export default function PasswordResendScreen() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarColor, setSnackbarColor] = useState<string>('');
  const { user, isThemeDark } =
    useContext<PreferencesContextProps>(PreferencesContext);
  const { colors } = useTheme();

  const processForgottenPassword = async () => {
    try {
      setLoading(true);
      const request: ReportRequest = {
        userId: user?.userId ?? 0,
        reportMessage: email,
        category: ReportCategory.FORGOTTEN_PASSWORD
      };
      const result = await submitUserReport(request);

      setSnackBarContent(
        i18n.t(result.message),
        result.success ? successColor : errorColor
      );

      if (result.success) {
        setSnackbarVisible(false);
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

  const emailError = email !== '' && !isEmailValid(email);

  const isResendPasswordFormValid = () => {
    return isEmailValid(email);
  };

  const getIconColor = (hasError: boolean) =>
    hasError ? colors.error : colors.outline;

  const dismissSnackBar = () => setSnackbarVisible(false);

  return (
    <SafeAreaProvider style={styles.container}>
      <TextInput
        label={i18n.t('profile.email')}
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        error={emailError}
        keyboardType="email-address"
        textContentType="emailAddress"
        right={<TextInput.Icon icon="email" color={getIconColor(emailError)} />}
      />

      <HelperText type="error" visible={emailError}>
        {i18n.t('profile.errors.emailError')}
      </HelperText>

      <Button
        mode="contained"
        onPress={processForgottenPassword}
        style={styles.button}
        buttonColor={colors.secondary}
        labelStyle={{ color: colors.surfaceVariant }}
        icon="login-variant"
        disabled={!isResendPasswordFormValid()}
      >
        <Text variant="bodyLarge" style={{ color: colors.surfaceVariant }}>
          {i18n.t('profile.resendPassword')}
        </Text>
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={dismissSnackBar}
        duration={Snackbar.DURATION_SHORT}
        style={{ backgroundColor: snackbarColor }}
      >
        <Text
          style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  input: {
    width: 240,
    marginBottom: 16
  },
  button: {
    marginBottom: 120
  }
});
