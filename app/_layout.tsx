import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { NativeEventEmitter, NativeModules } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export interface BlueToothContextType {
  sensorValue: number | null;
  setSensorValue: any;
  BleManagerEmitter: NativeEventEmitter;
}

const BleManagerModule = NativeModules.BleManager;
// @ts-ignore
export const BlueToothContext = createContext<BlueToothContextType>({
  sensorValue: null,
  setSensorValue: null,
  BleManagerEmitter: new NativeEventEmitter(BleManagerModule)
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    MonomaniacOneRegular: require('../assets/fonts/MonomaniacOne-Regular.ttf'),
  });

  const [sensorValue, setSensorValue] = React.useState<number | null>(null);

  const value = React.useMemo(() => {
    return {
      sensorValue,
      setSensorValue,
      BleManagerEmitter: new NativeEventEmitter(BleManagerModule),
    }
  }, [sensorValue, setSensorValue]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BlueToothContext.Provider value={value}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
          <Stack.Screen name="+not-found"/>
        </Stack>
      </BlueToothContext.Provider>
    </ThemeProvider>
  );
}
