import { StyleSheet, View } from 'react-native';

import { List } from 'react-native-paper';

const mockData = [
  { id: 1, title: 'Parking spot 10 is free', description: 'Time - 17:07:05' },
  {
    id: 2,
    title: 'Parking spot 5 has been taken',
    description: 'Time - 14:37:03'
  },
  {
    id: 3,
    title: 'Parking spot 7 has been taken',
    description: 'Time - 14:37:01'
  }
];

export default function NotificationsScreen() {
  return (
    <View style={styles.page}>
      <List.Section>
        {mockData.map((item, index) => (
          <List.Item
            key={item.id}
            title={item.title}
            description={item.description}
            onPress={() => {}}
            style={[index !== mockData.length - 1 && styles.itemDivider]}
          />
        ))}
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  topText: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 6,
    marginTop: 12
  },
  itemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2c'
  }
});
