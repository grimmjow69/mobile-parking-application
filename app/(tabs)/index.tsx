import { Dimensions, StyleSheet, View } from 'react-native';

import MapView, { Marker, Polygon, Region } from 'react-native-maps';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { PreferencesContext } from '../context/preference-context';
import { ActivityIndicator, Button, IconButton, Snackbar, Text } from 'react-native-paper';
import { ParkingSpot } from '../models/parking-spot';
import { fetchAllSpotsData } from '../services/parking-data-service';
import { LightMap, darkMap } from '@/constants/MapStyles';
import Colors from '@/constants/Colors';

export default function MapScreen() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [closestSpot, setClosestSpot] = useState<ParkingSpot | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#323232');
  const mapRef = useRef<MapView>(null);
  const { isThemeDark } = useContext(PreferencesContext);

  const [currentLocation, setCurrentLocation] = useState<Region | null>({
    latitude: 49.20423438192019,
    longitude: 18.75633519840852,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005
  });

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const allSpotsData = await fetchAllSpotsData();
      setParkingSpots(allSpotsData);
      setSnackbarMessage('Data loaded successfully');
      setSnackbarColor('#56ae57');
    } catch (error) {
      setSnackbarColor('#D32F2F');
    } finally {
      setSnackbarVisible(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const findClosestSpot = useCallback(() => {
    if (currentLocation) {
      const availableSpots = parkingSpots.filter((spot) => !spot.occupied);
      let closestSpot = availableSpots.reduce(
        (closest: { spot: ParkingSpot | null; distance: number }, spot: ParkingSpot) => {
          const spotDistance = getDistance(
            currentLocation.latitude,
            currentLocation.longitude,
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
    }
  }, [currentLocation, parkingSpots]);

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
    const markerColor = spot.occupied ? 'red' : 'green';

    const middleLatitude = spot.latitude;
    const middleLongitude = spot.longitude;
    const offset = 0.000012;

    const polygonCoordinates = [
      { latitude: middleLatitude + offset, longitude: middleLongitude + offset },
      { latitude: middleLatitude + offset, longitude: middleLongitude - offset },
      { latitude: middleLatitude - offset, longitude: middleLongitude - offset },
      { latitude: middleLatitude - offset, longitude: middleLongitude + offset }
    ];

    return (
      <React.Fragment key={spot.parkingSpotId}>
        <Polygon
          key={spot.parkingSpotId}
          coordinates={polygonCoordinates}
          strokeColor={markerColor}
          fillColor={markerColor}
        />
        {isClosestSpot && (
          <Marker
            key={'closest-overlay'}
            coordinate={{
              latitude: spot.latitude,
              longitude: spot.longitude
            }}
          />
        )}
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
            initialRegion={{
              latitude: 49.202337,
              longitude: 18.756124,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005
            }}
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
          <Button
            icon='magnify'
            mode='contained'
            style={styles.findClosestSpotButton}
            onPress={() => findClosestSpot()}
          >
            Find closest spot
          </Button>
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
  findClosestSpotButton: {
    position: 'absolute',
    bottom: 8
  },
  refreshButton: {
    position: 'absolute',
    top: 8,
    left: 8
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
