import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, TextInput } from 'react-native-paper';

export default function RegistrationScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordCheck, setPasswordCheck] = React.useState('');

  const handleRegister = () => {
    console.log('Register:', email, password);
  };

  return (
    <View style={styles.container}>
      <SafeAreaProvider style={styles.container}>
        <TextInput
          label='Email'
          value={email}
          onChangeText={setEmail}
          mode='outlined'
          style={styles.input}
          autoCapitalize='none'
          keyboardType='email-address'
          textContentType='emailAddress'
          right={<TextInput.Icon icon='account' />}
        />

        <TextInput
          label='Password'
          value={password}
          onChangeText={setPassword}
          mode='outlined'
          style={styles.input}
          secureTextEntry
          textContentType='password'
          right={<TextInput.Icon icon='lock' />}
        />

        <TextInput
          label='Password check'
          value={passwordCheck}
          onChangeText={setPasswordCheck}
          mode='outlined'
          style={styles.input}
          secureTextEntry
          textContentType='password'
          right={<TextInput.Icon icon='lock' />}
        />

        <Button mode='contained' onPress={handleRegister} style={styles.button} icon='register'>
          Register
        </Button>

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
  }
});
