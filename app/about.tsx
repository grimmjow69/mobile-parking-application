import i18n from '../assets/localization/i18n';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function AboutScreen() {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text
          variant="headlineSmall"
          style={[{ color: colors.tertiary }, styles.text]}
        >
          {i18n.t('about.title')}
        </Text>
        <Text
          variant="bodyLarge"
          style={[{ color: colors.tertiary }, styles.text]}
        >
          {i18n.t('about.content1')}
        </Text>
        <Text
          variant="bodyLarge"
          style={[{ color: colors.tertiary }, styles.text]}
        >
          {i18n.t('about.content2')}
        </Text>
        <Text
          variant="bodyLarge"
          style={[{ color: colors.tertiary }, styles.text]}
        >
          {i18n.t('about.content3')}
        </Text>
        <Text
          variant="bodyLarge"
          style={[{ color: colors.tertiary }, styles.text]}
        >
          {i18n.t('about.content4')}
        </Text>
        <Text
          variant="bodyLarge"
          style={[{ color: colors.tertiary }, styles.text]}
        >
          {i18n.t('about.content5')}
        </Text>
        <Text
          variant="bodyLarge"
          style={[{ color: colors.tertiary }, styles.text]}
        >
          {i18n.t('about.content6')}
        </Text>
        <Text
          variant="bodyLarge"
          style={[{ color: colors.tertiary }, styles.text]}
        >
          {i18n.t('about.end')}
        </Text>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  text: {
    marginBottom: 12,
    textAlign: 'center'
  }
});
