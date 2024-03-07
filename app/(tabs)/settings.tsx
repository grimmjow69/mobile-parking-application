import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../assets/localization/i18n';
import React, { useState } from 'react';
import { Button, Switch, Text } from 'react-native-paper';
import { PreferencesContext } from '../context/preference-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
  const { toggleTheme, isThemeDark, setLanguage } = React.useContext(PreferencesContext);
  const [isLanguageEnglish, setIsLanguageEnglish] = useState(i18n.language === 'en');

  const toggleLanguage = async () => {
    const newLanguage = isLanguageEnglish ? 'sk' : 'en';
    setIsLanguageEnglish(!isLanguageEnglish);
    i18n.changeLanguage(newLanguage);
    await AsyncStorage.setItem('language', newLanguage);
    setLanguage(newLanguage);
  };

  const toggleDarkTheme = async () => {
    toggleTheme();
    const newTheme = isThemeDark ? 'light' : 'dark';
    await AsyncStorage.setItem('theme', newTheme);
  };

  const reportBug = () => {
    console.log('Bug report button tapped');
  };

  return (
    <View style={styles.container}>
      <SafeAreaProvider style={styles.container}>
        <View style={styles.content}>
          <View style={styles.switchRow}>
            <Text>{i18n.t('settings.darkTheme')}</Text>
            <Switch value={isThemeDark} onValueChange={toggleDarkTheme} />
          </View>

          <View style={styles.switchRow}>
            <Text>{i18n.t('settings.useEnglish')}</Text>
            <Switch value={isLanguageEnglish} onValueChange={toggleLanguage} />
          </View>
          <View style={styles.footer}>
            <Button icon='bug' mode='contained' style={styles.reportButton} onPress={reportBug}>
              {i18n.t('settings.reportBug')}
            </Button>
            <Text>{i18n.t('settings.author')}: Lukáš Fuček</Text>
            <Text>{i18n.t('settings.version')}: 1.0.0</Text>
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
