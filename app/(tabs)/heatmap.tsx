import { Dimensions, StyleSheet, View } from 'react-native';

import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import { useCallback, useContext, useEffect, useState } from 'react';
import { HeatmapPoint } from '../models/heatmap';
import { fetchHeatmapData } from '../services/parking-data-service';
import { ActivityIndicator, IconButton, Snackbar, Text } from 'react-native-paper';
import { PreferencesContext } from '../context/preference-context';
import { LightMap, darkMap } from '@/constants/MapStyles';
import Colors from '@/constants/Colors';
import i18n from '../../assets/localization/i18n';

export default function HeatmapScreen() {
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#323232');
  const { isThemeDark } = useContext(PreferencesContext);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const points = await fetchHeatmapData();
      setHeatmapPoints(points);
      setSnackbarMessage(i18n.t('base.loadSuccess'));
      setSnackbarColor('#56ae57');
    } catch (error) {
      setSnackbarMessage(i18n.t('base.loadFailed'));
      setSnackbarColor('#D32F2F');
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
            customMapStyle={isThemeDark ? darkMap : LightMap}
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
            mode='contained'
            iconColor={Colors[isThemeDark ? 'dark' : 'light'].refreshIconText}
            containerColor={Colors[isThemeDark ? 'dark' : 'light'].refreshIcon}
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
        style={{ backgroundColor: snackbarColor, alignItems: 'center' }}
      >
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color:'#fff' }}> {snackbarMessage}</Text>
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
    top: 8,
    left: 8
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
