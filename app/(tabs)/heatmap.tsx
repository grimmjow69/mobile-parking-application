import Colors from '@/constants/Colors';
import i18n from '../../assets/localization/i18n';
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { ActivityIndicator, IconButton, Snackbar, Text, useTheme } from 'react-native-paper';
import { darkMap, LightMap } from '@/constants/map-styles';
import { Dimensions, StyleSheet, View } from 'react-native';
import { getHeatmapData } from '../services/parking-data-service';
import { HeatmapPoint } from '../models/heatmap';
import { PreferencesContext, PreferencesContextProps } from '../context/preference-context';
import { UNIZA_INITIAL_REGION } from '@/constants/coords';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

const GRADIENT_COLORS = [
  'transparent',
  '#BBCF4C',
  '#EEC20B',
  '#F29305',
  '#E50000'
];
const START_POINTS = [0, 0.25, 0.5, 0.75, 1];

export default function HeatmapScreen() {
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarColor, setSnackbarColor] = useState<string>('');
  const { isThemeDark } =
    useContext<PreferencesContextProps>(PreferencesContext);

  const isFocused = useIsFocused();
  const { colors } = useTheme();

  const fetchHeatmapData = useCallback(async () => {
    setLoading(true);
    try {
      const points = await getHeatmapData();
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
    if (isFocused) {
      fetchHeatmapData();
    }
  }, [isFocused, fetchHeatmapData]);

  const dismissSnackBar = () => setSnackbarVisible(false);

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={UNIZA_INITIAL_REGION}
        showsPointsOfInterest={false}
        provider={PROVIDER_GOOGLE}
        customMapStyle={isThemeDark ? darkMap : LightMap}
        style={styles.map}
      >
        {loading || heatmapPoints.length === 0 ? (
          <></>
        ) : (
          <Heatmap
            points={heatmapPoints}
            gradient={{
              colors: GRADIENT_COLORS,
              startPoints: START_POINTS,
              colorMapSize: 500
            }}
            radius={10}
            opacity={0.7}
          />
        )}
      </MapView>
      <IconButton
        icon="refresh"
        mode="contained"
        iconColor={colors.surfaceVariant}
        containerColor={colors.secondary}
        size={28}
        style={styles.refreshButton}
        onPress={() => fetchHeatmapData()}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={dismissSnackBar}
        duration={1000}
        style={{
          backgroundColor: snackbarColor,
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fff'
          }}
        >
          {' '}
          {snackbarMessage}
        </Text>
      </Snackbar>

      <SpinnerOverlay
        textContent={i18n.t('base.wait')}
        textStyle={
          isThemeDark
            ? {
                color: '#fff'
              }
            : {
                color: '#303c64'
              }
        }
        animation="fade"
        visible={loading}
        overlayColor={Colors[isThemeDark ? 'dark' : 'light'].spinnerOverlay}
        customIndicator={
          <ActivityIndicator
            size="large"
            color={Colors[isThemeDark ? 'dark' : 'light'].spinnerColor}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  refreshButton: {
    position: 'absolute',
    top: 4,
    left: 4
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
