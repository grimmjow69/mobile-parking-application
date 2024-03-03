import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Badge, Icon } from 'react-native-paper';
import { View } from '@/components/Themed';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          height: 60
        },
        tabBarItemStyle: {
          margin: 4
        },
        tabBarLabelStyle: {
          fontSize: 12
        }
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Parking Map',
          tabBarIcon: ({ color }) => <Icon source='map-marker-multiple' color={color} size={26} />,
          headerRight: () => (
            <Link href='/notifications' asChild>
              <Pressable>
                <View style={styles.notificationsBell}>
                  <Badge size={16} style={[styles.notificationsBadge]}>
                    3
                  </Badge>
                  <Icon source='bell' size={30} />
                </View>
              </Pressable>
            </Link>
          )
        }}
      />
      <Tabs.Screen
        name='heatmap'
        options={{
          title: 'Heatmap',
          tabBarIcon: ({ color }) => <Icon source='map-clock' color={color} size={26} />,
          headerRight: () => (
            <Link href='/notifications' asChild>
              <Pressable>
                <View style={styles.notificationsBell}>
                  <Badge size={16} style={[styles.notificationsBadge]}>
                    3
                  </Badge>
                  <Icon source='bell' size={30} />
                </View>
              </Pressable>
            </Link>
          )
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon source='account' color={color} size={26} />,
          headerRight: () => (
            <Link href='/notifications' asChild>
              <Pressable>
                <View style={styles.notificationsBell}>
                  <Badge size={16} style={[styles.notificationsBadge]}>
                    3
                  </Badge>
                  <Icon source='bell' size={30} />
                </View>
              </Pressable>
            </Link>
          )
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Icon source='cog' color={color} size={26} />,
          headerRight: () => (
            <Link href='/notifications' asChild>
              <Pressable>
                <View style={styles.notificationsBell}>
                  <Badge size={16} style={[styles.notificationsBadge]}>
                    3
                  </Badge>
                  <Icon source='bell' size={30} />
                </View>
              </Pressable>
            </Link>
          )
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#303c64'
  },
  notificationsBadge: {
    position: 'absolute',
    zIndex: 1
  },
  notificationsBell: {
    marginRight: 12
  }
});
