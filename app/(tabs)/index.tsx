import { Dimensions, StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import MapView, { Marker, Region } from 'react-native-maps';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';



export default function MapScreen() {

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 49.202337,
          longitude: 18.756124,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }}
        showsUserLocation={true}
        showsCompass={true}
        showsPointsOfInterest={false}
      >
        <Marker
          key={1}
          coordinate={{ latitude: 49.204337721560485, longitude: 18.756124391955183 }}
        />
        <Marker
          key={2}
          coordinate={{ latitude: 49.404337721560485, longitude: 18.956124391955183 }}
        />
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
