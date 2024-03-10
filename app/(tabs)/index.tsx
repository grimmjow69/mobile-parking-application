import * as Location from 'expo-location';
import Colors from '@/constants/colors';
import i18n from '../../assets/localization/i18n';
import MapView, { Circle, Marker } from 'react-native-maps';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Button, Divider, IconButton, Modal, Snackbar, Text } from 'react-native-paper';
import { darkMap, LightMap } from '@/constants/map-styles';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import {
  fetchAllSpotsData,
  fetchSpotCoordinates,
  fetchSpotDetailById
} from '../services/parking-data-service';
import { ParkingSpot, ParkingSpotDetail } from '../models/parking-spot';
import { PreferencesContext } from '../context/preference-context';
import { UNIZA_INITIAL_REGION } from '@/constants/coords';
import { useIsFocused } from '@react-navigation/native';

export interface ModalContent {
  spotName: string;
  occupied: boolean;
  detail: ParkingSpotDetail | null;
}

export default function MapScreen() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(false);
  const [closestSpot, setClosestSpot] = useState<ParkingSpot | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#323232');
  const mapRef = useRef<MapView>(null);
  const { isThemeDark, user } = useContext(PreferencesContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const isFocused = useIsFocused();

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const allSpotsData = await fetchAllSpotsData();
      setParkingSpots(allSpotsData);
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
      getData();
    }
  }, [isFocused, getData]);

  useEffect(() => {}, [modalContent]);

  const findClosestSpot = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setSnackbarMessage(i18n.t('base.locationPermissionDenied'));
      setSnackbarColor('#D32F2F');
      setSnackbarVisible(true);
      return;
    }
    setLoading(true);
    let location = await Location.getCurrentPositionAsync({});
    const userLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    };

    if (userLocation) {
      const availableSpots = parkingSpots.filter((spot) => !spot.occupied);
      let closestSpot = availableSpots.reduce(
        (closest: { spot: ParkingSpot | null; distance: number }, spot: ParkingSpot) => {
          const spotDistance = getDistance(
            userLocation.latitude,
            userLocation.longitude,
            spot.latitude,
            spot.longitude
          );
          if (spotDistance < closest.distance) {
            return {
              spot,
              distance: spotDistance
            };
          }
          return closest;
        },
        { spot: null, distance: Infinity }
      );
      setLoading(false);
      if (closestSpot.spot) {
        setClosestSpot(closestSpot.spot);
        setSnackbarMessage(i18n.t('parkingMap.closestSpotFound'));
        setSnackbarColor('#56ae57');
        mapRef.current?.animateToRegion({
          latitude: closestSpot.spot.latitude,
          longitude: closestSpot.spot.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        });
      } else {
        setSnackbarMessage(i18n.t('parkingMap.noSpotFound'));
        setSnackbarColor('#D32F2F');
      }

      setSnackbarVisible(true);
    }
  }, [parkingSpots]);

  const findClosestSpotToFav = useCallback(async () => {
    if (user?.favouriteSpotId) {
      try {
        setLoading(true);
        const favSpotCoordinates = await fetchSpotCoordinates(user.favouriteSpotId);
        const availableSpots = parkingSpots.filter((spot) => !spot.occupied);
        let closestSpot = availableSpots.reduce(
          (closest: { spot: ParkingSpot | null; distance: number }, spot: ParkingSpot) => {
            const spotDistance = getDistance(
              favSpotCoordinates.latitude,
              favSpotCoordinates.longitude,
              spot.latitude,
              spot.longitude
            );
            if (spotDistance < closest.distance) {
              return {
                spot,
                distance: spotDistance
              };
            }
            return closest;
          },
          { spot: null, distance: Infinity }
        );

        setClosestSpot(closestSpot.spot);

        if (closestSpot.spot) {
          mapRef.current?.animateToRegion({
            latitude: closestSpot.spot.latitude,
            longitude: closestSpot.spot.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001
          });
        }

        setSnackbarMessage(i18n.t('parkingMap.closestSpotFound'));
        setSnackbarColor('#56ae57');
      } catch (error) {
        setSnackbarMessage(i18n.t('parkingMap.closestSpotFindError'));
        setSnackbarColor('#D32F2F');
      } finally {
        setLoading(false);
        setSnackbarVisible(true);
      }
    } else {
      setSnackbarMessage(i18n.t('parkingMap.noFavSpot'));
      setSnackbarColor('#D32F2F');
      setSnackbarVisible(true);
    }
  }, [user?.favouriteSpotId, parkingSpots]);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const handleMarkerPress = async (spotName: string, occupied: boolean, spotId: number) => {
    try {
      const parkingSpotDetail = await fetchSpotDetailById(user ? user.userId : 0, spotId);
      setModalContent({
        spotName: spotName,
        occupied: occupied,
        detail: parkingSpotDetail
      });

      setModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch parking spot details:', error);
    }
  };

  const renderMarker = (spot: ParkingSpot) => {
    const isClosestSpot = spot === closestSpot;
    const circleColor = spot.occupied ? '#DC143C' : '#228B22';
    const updatedAtText = `${i18n.t('parkingMap.updatedAt')} ${moment(spot.updatedAt).format(
      'HH:mm:ss'
    )}`;

    return (
      <React.Fragment key={spot.parkingSpotId}>
        {isClosestSpot && (
          <Marker
            key={'closest-overlay'}
            coordinate={{
              latitude: spot.latitude,
              longitude: spot.longitude
            }}
          />
        )}
        <Marker
          key={spot.parkingSpotId}
          opacity={0}
          icon={require('../../assets/images/icon.png')}
          title={spot.name}
          description={updatedAtText}
          coordinate={{
            latitude: spot.latitude,
            longitude: spot.longitude
          }}
          onCalloutPress={() => handleMarkerPress(spot.name, spot.occupied, spot.parkingSpotId)}
        />
        <Circle
          center={{
            latitude: spot.latitude,
            longitude: spot.longitude
          }}
          radius={1}
          strokeWidth={1}
          strokeColor={circleColor}
          fillColor={circleColor}
        />
      </React.Fragment>
    );
  };

  const onDismissSnackBar = () => setSnackbarVisible(false);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={UNIZA_INITIAL_REGION}
        showsUserLocation={true}
        showsCompass={true}
        showsPointsOfInterest={false}
        customMapStyle={isThemeDark ? darkMap : LightMap}
      >
        {loading ? <></> : <>{parkingSpots.map(renderMarker)}</>}
        {parkingSpots.map(renderMarker)}
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
      <View style={styles.bottomButtons}>
        <Button icon='magnify' mode='contained' onPress={() => findClosestSpot()}>
          {i18n.t('parkingMap.findClosestSpot')}
        </Button>
        {user?.favouriteSpotId && (
          <Button
            icon='star'
            mode='contained'
            style={styles.findFavParkingSpot}
            onPress={() => findClosestSpotToFav()}
          >
            {i18n.t('parkingMap.findClosestSpot')}
          </Button>
        )}
      </View>
      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {modalContent?.spotName}
            {' - '}
            {modalContent?.occupied
              ? i18n.t('parkingMap.parkingSpotDetail.header.stateOccuipied')
              : i18n.t('parkingMap.parkingSpotDetail.header.stateFree')}
          </Text>
          {user && (
            <View style={styles.modalActionIcons}>
              <IconButton
                icon={modalContent?.detail?.isNotificationEnabled ? 'bell' : 'bell-outline'}
                iconColor={modalContent?.detail?.isNotificationEnabled ? 'blue' : 'black'}
                size={30}
                onPress={() => {
                  setNotificationsEnabled(!notificationsEnabled);
                }}
              />
              <IconButton
                icon={modalContent?.detail?.isFavourite ? 'star' : 'star-outline'}
                iconColor={modalContent?.detail?.isFavourite ? 'blue' : 'black'}
                size={30}
                onPress={() => {
                  setIsFavorite(!isFavorite);
                }}
              />
            </View>
          )}
        </View>
        <Divider />
        <ScrollView style={styles.modalScrollContent}>
          <View style={styles.historyHeaderRow}>
            <View style={styles.historyHeaderColumn}>
              <Text style={styles.historyHeaderText}>
                {i18n.t('parkingMap.parkingSpotDetail.table.stateColumnName')}
              </Text>
            </View>
            <View style={styles.historyHeaderColumn}>
              <Text style={styles.historyHeaderText}>
                {i18n.t('parkingMap.parkingSpotDetail.table.updatedAtColumnName')}
              </Text>
            </View>
          </View>
          {modalContent?.detail?.history?.map((historyItem, index) => (
            <View key={index} style={styles.historyRow}>
              <View style={styles.historyColumn}>
                <Text style={styles.historyText}>
                  {historyItem.occupied
                    ? i18n.t('parkingMap.parkingSpotDetail.table.stateFree')
                    : i18n.t('parkingMap.parkingSpotDetail.table.stateOccuipied')}
                </Text>
              </View>
              <View style={styles.historyColumn}>
                <Text style={styles.historyText}>
                  {moment(historyItem.updatedAt).format('HH:mm:ss DD.MM.YYYY')}
                </Text>
              </View>
              <Divider />
            </View>
          ))}
        </ScrollView>
        <View style={styles.modalFooter}>
          <Button
            mode='contained'
            style={styles.closeModalButton}
            onPress={() => setModalVisible(false)}
          >
            {i18n.t('base.close')}
          </Button>
        </View>
      </Modal>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        duration={1000}
        style={{ backgroundColor: snackbarColor, alignItems: 'center' }}
      >
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>
          {' '}
          {snackbarMessage}
        </Text>
      </Snackbar>
      {/* <SpinnerOverlay
        visible={loading}
        overlayColor={Colors[isThemeDark ? 'dark' : 'light'].spinnerOverlay}
        customIndicator={
          <ActivityIndicator
            size='large'
            color={Colors[isThemeDark ? 'dark' : 'light'].spinnerColor}
          />
        }
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 8
  },
  refreshButton: {
    position: 'absolute',
    top: 8,
    left: 8
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    height: Dimensions.get('window').height * 0.65
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  modalFooter: {
    alignItems: 'center'
  },
  closeModalButton: {
    marginTop: 20
  },
  modalActionIcons: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  modalScrollContent: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  },
  findFavParkingSpot: {
    marginTop: 8
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: '#f0f0f0'
  },
  historyHeaderColumn: {
    flex: 1,
    paddingHorizontal: 8
  },
  historyHeaderText: {
    fontWeight: 'bold'
  },
  historyText: {},

  historyColumn: {
    flex: 1,
    paddingHorizontal: 8
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
