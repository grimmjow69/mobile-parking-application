import { useNavigation } from 'expo-router';
import i18n from '../assets/localization/i18n';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export default function AboutScreen() {
  const navigation = useNavigation();
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
        <View style={styles.bottomView}>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={[
              {
                marginTop: 12,
                width: 120,
                backgroundColor: '#F77D24',
              }
            ]}
          >
            <Text variant="bodyLarge" style={{ color: '#fff' }}>
              {i18n.t('base.close')}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    marginBottom: 12,
    textAlign: 'center'
  },
  bottomView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
