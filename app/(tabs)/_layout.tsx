import Colors from '@/constants/Colors';
import i18n from '../../assets/localization/i18n';
import React from 'react';
import { Badge, Icon } from 'react-native-paper';
import { Link, Tabs } from 'expo-router';
import { PreferencesContext } from '../context/preference-context';
import { Pressable, StyleSheet, View } from 'react-native';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';


export default function TabLayout() {
  const { isThemeDark } = React.useContext(PreferencesContext);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[isThemeDark ? 'dark' : 'light'].tint,
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
          title: i18n.t('navigation.parkingMap'),
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
          title: i18n.t('navigation.heatmap'),
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
          title: i18n.t('navigation.profile'),
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
          title: i18n.t('navigation.settings'),
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
  },
  notificationsBadge: {
    position: 'absolute',
    zIndex: 1,
  },
  notificationsBell: {
    marginRight: 12
  }
});
