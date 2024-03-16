import Colors from '@/constants/Colors';
import i18n from '../../assets/localization/i18n';
import { Icon } from 'react-native-paper';
import { PreferencesContext, PreferencesContextProps } from '../context/preference-context';
import { Tabs } from 'expo-router';
import { useContext } from 'react';

export default function TabLayout() {
  const { isThemeDark } =
    useContext<PreferencesContextProps>(PreferencesContext);
    
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[isThemeDark ? 'dark' : 'light'].tint,
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
        name="index"
        options={{
          title: i18n.t('navigation.parkingMap'),
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => (
            <Icon source="parking" color={color} size={26} />
          )
        }}
      />
      <Tabs.Screen
        name="heatmap"
        options={{
          title: i18n.t('navigation.heatmap'),
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => (
            <Icon source="map-clock" color={color} size={26} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: i18n.t('navigation.profile'),
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => (
            <Icon source="account" color={color} size={26} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: i18n.t('navigation.settings'),
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => (
            <Icon source="cog" color={color} size={26} />
          )
        }}
      />
    </Tabs>
  );
}
