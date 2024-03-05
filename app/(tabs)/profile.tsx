import { StyleSheet, View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, TextInput, Text, Snackbar } from 'react-native-paper';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'expo-router';
import i18n from '../../assets/localization/i18n';
import { PreferencesContext } from '../context/preference-context';
import { loginUser } from '../services/auth-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const { user, setUser } = useContext(PreferencesContext);
  const [email, setEmail] = useState('lukasfucek30@gmail.com');
  const [password, setPassword] = useState('123456');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#56ae57');

  const showSnackbar = (message: string, color = '#56ae57') => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };

  const handleLoginSuccess = async (userData: any) => {
    setUser(userData);
    const userJson = JSON.stringify(userData);
    await AsyncStorage.setItem('user', userJson);
  };

  const handleLogin = async () => {
    await loginUser(email, password, showSnackbar, handleLoginSuccess);
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Failed to clear user data', error);
    }
  };

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
