import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, Switch, useTheme } from 'react-native-paper';
import React from 'react';

export default function TabTwoScreen() {
  const { colors } = useTheme();

  const [isThemeDark, setIsThemeDark] = React.useState(false);
  const [isLanguageEnglish, setIsLanguageEnglish] = React.useState(true);
  const [arePushNotificationsEnabled, setArePushNotificationsEnabled] = React.useState(true);
  const [isLocationEnabled, setIsLocationEnabled] = React.useState(false);

  const toggleTheme = () => {
    setIsThemeDark(!isThemeDark);
  };

  const toggleLanguage = () => {
    setIsLanguageEnglish(!isLanguageEnglish);
  };

  const reportBug = () => {
    console.log('Bug report button tapped');
  };

  const toggleLocationServices = () => {
    setIsLocationEnabled(!isLocationEnabled);
  };

  const togglePushNotifications = () => {
    setArePushNotificationsEnabled(!arePushNotificationsEnabled);
  };

  return (
    <View style={styles.container}>
      <SafeAreaProvider style={styles.container}>
        <View style={styles.content}>
          <View style={styles.switchRow}>
            <Text>Dark Theme</Text>
            <Switch value={isThemeDark} onValueChange={toggleTheme} color={colors.primary} />
          </View>

          <View style={styles.switchRow}>
            <Text>English Language</Text>
            <Switch
              value={isLanguageEnglish}
              onValueChange={toggleLanguage}
              color={colors.primary}
            />
          </View>

          <View style={styles.switchRow}>
            <Text>Location Services</Text>
            <Switch
              value={isLocationEnabled}
              onValueChange={toggleLocationServices}
              color={colors.primary}
            />
          </View>

          <View style={styles.switchRow}>
            <Text>Push Notifications</Text>
            <Switch
              value={arePushNotificationsEnabled}
              onValueChange={togglePushNotifications}
              color={colors.primary}
            />
          </View>

          <View style={styles.footer}>
            <Button icon='bug' mode='contained' style={styles.reportButton} onPress={reportBug}>
              Report Bug
            </Button>
            <Text>Author: Your Name</Text>
            <Text>Version: 1.0.0</Text>
          </View>
        </View>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 100
  },
  reportButton: {
    marginBottom: 30
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center'
  }
});
