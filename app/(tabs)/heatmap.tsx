import { Dimensions, StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import { useCallback, useEffect, useState } from 'react';
import { HeatmapPoint } from '../models/heatmap';
import { fetchHeatmapData } from '../services/heatmap-data-service';
import { ActivityIndicator, Button, IconButton } from 'react-native-paper';

export default function HeatmapScreen() {
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const points = await fetchHeatmapData();
      setHeatmapPoints(points);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} size={'large'} />
      ) : (
        <>
          <MapView
            initialRegion={{
              latitude: 49.202337,
              longitude: 18.756124,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005
            }}
            showsPointsOfInterest={false}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
          >
            <Heatmap
              points={heatmapPoints}
              gradient={{
                colors: ['green', 'yellow', 'orange', 'red'],
                startPoints: [0.25, 0.5, 0.75, 1],
                colorMapSize: 256
              }}
              radius={10}
              opacity={0.7}
            />
          </MapView>
          <Button
            icon='refresh'
            mode='contained'
            style={styles.refreshButton}
            onPress={() => getData()}
          >
            Refresh
          </Button>
        </>
      )}
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
  refreshButton: {
    position: 'absolute',
    bottom: 8,
    right: 8
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
