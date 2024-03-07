import * as Location from 'expo-location';
import Colors from '@/constants/colors';
import i18n from '../../assets/localization/i18n';
import MapView, { Circle, Marker, Region } from 'react-native-maps';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, IconButton, Snackbar, Text } from 'react-native-paper';
import { darkMap, LightMap } from '@/constants/map-styles';
import { Dimensions, StyleSheet, View } from 'react-native';
import { fetchAllSpotsData, fetchSpotCoordinates } from '../services/parking-data-service';
import { ParkingSpot } from '../models/parking-spot';
import { PreferencesContext } from '../context/preference-context';
import { UNIZA_INITIAL_REGION } from '@/constants/coords';
import { useIsFocused } from '@react-navigation/native';

export default function MapScreen() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(false);
  const [closestSpot, setClosestSpot] = useState<ParkingSpot | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#323232');
  const mapRef = useRef<MapView>(null);
  const { isThemeDark, user } = useContext(PreferencesContext);
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

  const findClosestSpot = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setSnackbarMessage(i18n.t('base.locationPermissionDenied'));
      setSnackbarColor('#D32F2F');
      setSnackbarVisible(true);
      return;
    }

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

  const renderMarker = (spot: ParkingSpot) => {
    const isClosestSpot = spot === closestSpot;
    const circleColor = spot.occupied ? '#DC143C' : '#228B22';

    const middleLatitude = spot.latitude;
    const middleLongitude = spot.longitude;

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
        <Circle
          center={{
            latitude: middleLatitude,
            longitude: middleLongitude
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
      {loading ? (
        <ActivityIndicator animating={true} size={'large'} />
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={UNIZA_INITIAL_REGION}
            maxZoomLevel={19}
            showsUserLocation={true}
            showsCompass={true}
            showsPointsOfInterest={false}
            customMapStyle={isThemeDark ? darkMap : LightMap}
          >
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
        </>
      )}
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
  findFavParkingSpot: {
    marginTop: 8
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
