import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

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
          margin: 5
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
          tabBarIcon: ({ color }) => <TabBarIcon name='map-signs' color={color} />,
          headerRight: () => (
            <Link href='/notifications' asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name='bell'
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          )
        }}
      />
      <Tabs.Screen
        name='heatmap'
        options={{
          title: 'Heatmap',
          tabBarIcon: ({ color }) => <TabBarIcon name='map' color={color} />,
          headerRight: () => (
            <Link href='/notifications' asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name='bell'
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          )
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name='user' color={color} />,
          headerRight: () => (
            <Link href='/notifications' asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name='bell'
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          )
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name='cog' color={color} />,
          headerRight: () => (
            <Link href='/notifications' asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name='bell'
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          )
        }}
      />
    </Tabs>
  );
}
