import i18n from '../assets/localization/i18n';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useState } from 'react';

export default function PasswordResendScreen() {
  const [email, setEmail] = useState('');

  const handleForgottenPassword = () => {
    console.log('Forgotten password:', email);
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <TextInput
        label={i18n.t('profile.email')}
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        right={<TextInput.Icon icon="email" />}
      />

      <Button
        mode="contained"
        onPress={handleForgottenPassword}
        style={styles.button}
        icon="login-variant"
      >
        {i18n.t('profile.resendPassword')}
      </Button>
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
    marginTop: 20,
    marginBottom: 120
  }
});
