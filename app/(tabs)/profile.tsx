import { StyleSheet, View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, TextInput, Text } from 'react-native-paper';
import React, { useContext } from 'react';
import { Link } from 'expo-router';
import i18n from '../../assets/localization/i18n';
import { PreferencesContext } from '../context/preference-context';

export default function TabTwoScreen() {
  const {} = useContext(PreferencesContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    console.log('Login with:', email, password);
  };
  return (
    <View style={styles.container}>
      <SafeAreaProvider style={styles.container}>
        <TextInput
          label={i18n.t('profile.email')}
          value={email}
          onChangeText={setEmail}
          mode='outlined'
          style={styles.input}
          autoCapitalize='none'
          keyboardType='email-address'
          textContentType='emailAddress'
          right={<TextInput.Icon icon='email' />}
        />

        <TextInput
          label={i18n.t('profile.password')}
          value={password}
          onChangeText={setPassword}
          mode='outlined'
          style={styles.input}
          secureTextEntry
          textContentType='password'
          right={<TextInput.Icon icon='lock' />}
        />

        <Button mode='contained' onPress={handleLogin} style={styles.button} icon='login'>
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
    width: 240,
    marginBottom: 16
  },
  button: {
    marginTop: 40
  },
  registerText: {
    marginTop: 16
  },
  linkText: {
    fontWeight: 'bold'
  }
});
