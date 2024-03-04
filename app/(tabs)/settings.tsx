import { StyleSheet, View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, Switch, useTheme, Text } from 'react-native-paper';
import React from 'react';
import { PreferencesContext } from '../context/preference-context';

export default function TabTwoScreen() {
  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
  const [isLanguageEnglish, setIsLanguageEnglish] = React.useState(true);
  const [isLocationEnabled, setIsLocationEnabled] = React.useState(false);

  const toggleLanguage = () => {
    setIsLanguageEnglish(!isLanguageEnglish);
  };

  const reportBug = () => {
    console.log('Bug report button tapped');
  };

  const toggleLocationServices = () => {
    setIsLocationEnabled(!isLocationEnabled);
  };

  return (
    <View style={styles.container}>
      <SafeAreaProvider style={styles.container}>
        <View style={styles.content}>
          <View style={styles.switchRow}>
            <Text>Dark Theme</Text>
            <Switch value={isThemeDark} onValueChange={toggleTheme} />
          </View>

          <View style={styles.switchRow}>
            <Text>English Language</Text>
            <Switch value={isLanguageEnglish} onValueChange={toggleLanguage} />
          </View>

          <View style={styles.switchRow}>
            <Text>Location Services</Text>
            <Switch value={isLocationEnabled} onValueChange={toggleLocationServices} />
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
