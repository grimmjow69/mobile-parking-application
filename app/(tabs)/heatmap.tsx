import { Dimensions, StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import { useCallback, useEffect, useState } from 'react';
import { HeatmapPoint } from '../models/heatmap';
import { fetchHeatmapData } from '../services/parking-data-service';
import { ActivityIndicator, IconButton, Snackbar } from 'react-native-paper';

export default function HeatmapScreen() {
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#323232');
  const [snackbarIcon, setSnackbarIcon] = useState('check-circle');

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const points = await fetchHeatmapData();
      setHeatmapPoints(points);
      setSnackbarMessage('Data loaded successfully');
      setSnackbarColor('#4CAF50');
      setSnackbarIcon('check-circle');
    } catch (error) {
      setSnackbarMessage('Failed to load data');
      setSnackbarColor('#D32F2F');
      setSnackbarIcon('alert-circle');
    } finally {
      setSnackbarVisible(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const onDismissSnackBar = () => setSnackbarVisible(false);

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
                colors: ['transparent', '#BBCF4C', '#EEC20B', '#F29305', '#E50000'],
                startPoints: [0, 0.25, 0.5, 0.75, 1],
                colorMapSize: 500
              }}
              radius={10}
              opacity={0.7}
            />
          </MapView>
          <IconButton
            icon='refresh'
            mode='contained-tonal'
            size={30}
            style={styles.refreshButton}
            onPress={() => getData()}
          />
        </>
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        duration={1000}
        style={{ backgroundColor: snackbarColor }}
        action={{
          icon: snackbarIcon,
          color: '#white', // <---- Add this.
          label: ''
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
