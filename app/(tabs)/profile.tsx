import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, TextInput } from 'react-native-paper';
import React from 'react';
import { Link } from 'expo-router';

export default function TabTwoScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    console.log('Login with:', email, password);
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
          right={<TextInput.Icon icon='email' />}
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

        <Button mode='contained' onPress={handleLogin} style={styles.button} icon='login'>
          Log in
        </Button>

        <Link href='/resend-password' asChild>
          <Button style={styles.button}>Forgot Password?</Button>
        </Link>

        <Text style={styles.registerText}>
          Don't have an account?{' '}
          <Link href='/registration' asChild>
            <Text style={styles.linkText} onPress={() => console.log('Navigate to registration')}>
              Register here
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
    fontWeight: 'bold',
    color: '#6200ee'
  }
});
