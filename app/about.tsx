import i18n from '../assets/localization/i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaProvider style={styles.container}></SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  }
});
