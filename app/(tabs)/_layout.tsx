import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Settings } from "react-native";

export default function TabLayout() {
  // https://icons.expo.fyi/Index for list of icons

  const colorScheme = useColorScheme();

  // set all the default settings here
  // React.useEffect(() => {
  //   Settings.set({ sampleRate: 32000 });
  //   Settings.set({ bitsPerSample: 8 });
  //   Settings.set({ bufferSize: 2048 });
  //   Settings.set({ maxGauge: 100 });
  //   Settings.set({ peakThreshold: 128+20 });
  //   Settings.set({ copingMode: false });
  //   Settings.set({ wheelDiameter: 80 });
  //   Settings.set({ darkMode: false });
  //   console.log("Settings initialized?");
  // }, []);

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
