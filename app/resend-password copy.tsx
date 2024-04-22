import { Icon } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import i18n from '@/assets/localization/i18n';

export default function NoInternetScreen() {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium">{i18n.t('base.noInternetConnection')}</Text>
      <View style={styles.noInternetIconWrap}>
        <Icon allowFontScaling={true} source="wifi-alert" size={60} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    textAlign: 'center'
  },
  noInternetIconWrap: {
    marginTop: 40
  }
});
