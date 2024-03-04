import { StyleSheet, View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { Button, TextInput } from 'react-native-paper';

export default function PasswordResendScreen() {
  const [email, setEmail] = React.useState('');

  const handleForgottenPassword = () => {
    console.log('Forgotten password:', email);
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

        <Button
          mode='contained'
          onPress={handleForgottenPassword}
          style={styles.button}
          icon='login-variant'
        >
          Resend password
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
