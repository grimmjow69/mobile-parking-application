import i18n from '../assets/localization/i18n';
import { Button, HelperText, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { registerUser } from './services/auth-service';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#56ae57');

  const onDismissSnackBar = () => setSnackbarVisible(false);

  const showSnackbar = (message: string, color = '#56ae57') => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };

  const handleRegister = async () => {
    if (isFormValid()) {
      await registerUser(email, password, showSnackbar, () => {
        setTimeout(() => navigation.goBack(), Snackbar.DURATION_SHORT);
      });
    }
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const isFormValid = () => {
    return validateEmail(email) && password === passwordCheck && password.length >= 6;
  };

  const { colors } = useTheme();
  const getIconColor = (hasError: boolean) => (hasError ? colors.error : colors.secondary);

  const emailError = email !== '' && !validateEmail(email);
  const passwordsMatchError = password !== '' && passwordCheck !== '' && password !== passwordCheck;
  const passwordLengthError = password !== '' && password.length < 6;

  return (
    <View style={styles.container}>
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
          right={<TextInput.Icon icon="lock" color={getIconColor(passwordLengthError)} />}
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
          right={<TextInput.Icon icon="lock" color={getIconColor(passwordsMatchError)} />}
        />
        <HelperText type="error" visible={passwordsMatchError}>
          {i18n.t('profile.errors.passwordsMatchError')}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          icon="login-variant"
          disabled={!isFormValid()}
        >
          {i18n.t('profile.register')}
        </Button>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={onDismissSnackBar}
          duration={Snackbar.DURATION_SHORT}
          style={{ backgroundColor: snackbarColor }}
        >
          <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}> {snackbarMessage}</Text>
        </Snackbar>
      </SafeAreaProvider>
    </View>
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
    marginTop: 40
  }
});
