import { Dimensions, StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';

const HEATMAPOINTS = [
  { latitude: 49.20432, longitude: 18.756154, weight: 8 },
  { latitude: 49.204307, longitude: 18.75621, weight: 30 },
  { latitude: 49.204295, longitude: 18.756259, weight: 60 },
  { latitude: 49.20428, longitude: 18.756319, weight: 100 },
];

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: 49.204337721560485,
          longitude: 18.756124391955183,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
      >
        <Heatmap
          points={HEATMAPOINTS}
          gradient={{
            colors: ['green', 'yellow', 'orange', 'red'],
            startPoints: [0.25, 0.5, 0.75, 1],
            colorMapSize: 256
          }}
          radius={24}
          opacity={0.7}
        ></Heatmap>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  },
  map: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
