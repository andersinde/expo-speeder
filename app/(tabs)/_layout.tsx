import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  // https://icons.expo.fyi/Index for list of icons

  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].background,
        tabBarInactiveBackgroundColor: Colors[colorScheme ?? 'light'].background,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Logs',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'list' : 'list-outline'} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="signal"
        options={{
          title: 'Signal',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'ear' : 'ear-outline'} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color}/>
          ),
        }}
      />
    </Tabs>
  );
}
