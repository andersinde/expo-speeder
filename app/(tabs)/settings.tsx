import { Appearance, KeyboardAvoidingView, Settings, StyleSheet, useColorScheme } from 'react-native';

import React, { useState } from "react";
import ThemedScrollView from "@/components/ThemedScrollView";
import SettingsRow from "@/components/SettingsRow";
import { ThemedView } from "@/components/ThemedView";
import { DarkTheme } from "@react-navigation/native";

interface AppSettings {
  copingMode: boolean;
  wheelDiameter: number;
  vibrateAtSpeed?: number;
  darkMode?: boolean;
}

const defaultSettings: AppSettings = {
  copingMode: true,
  wheelDiameter: 80,
  vibrateAtSpeed: 100,
};

export default function SettingsScreen() {
  const [copingMode, setCopingMode] = useState<boolean>(() => Settings.get('copingMode') ?? defaultSettings.copingMode);
  const [wheelDiameter, setWheelDiameter] = useState<number>(() => Settings.get('wheelDiameter') ?? defaultSettings.wheelDiameter);
  const [vibrateAtSpeed, setVibrateAtSpeed] = useState<number>(() => Settings.get('vibrateAtSpeed') ?? defaultSettings.vibrateAtSpeed);
  const [preferredDevice, setPreferredDevice] = useState<string>(() => Settings.get('preferredDevice') ?? '');
  const [darkMode, setDarkMode] = useState<boolean>(() => Settings.get('darkMode') ?? true);

  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedScrollView>
      <KeyboardAvoidingView>
        <ThemedView
          style={{ ...styles.container, backgroundColor: theme === 'light' ? '#fff' : DarkTheme.colors.card }}>
          <SettingsRow label="Preferred device" dataKey="preferredDevice" value={preferredDevice}
                       onSetValue={setPreferredDevice}
                       keyboardType="default"/>
          <SettingsRow label="Wheel diameter" dataKey="wheelDiameter" value={wheelDiameter.toString()}
                       onSetValue={(value) => setWheelDiameter(value.split(',').join('.'))}/>
          <SettingsRow label="Coping mode" dataKey="copingMode" value={copingMode}
                       onSetValue={setCopingMode} isBoolean/>
          <SettingsRow label="Vibrate at speed" dataKey={"vibrateAtSpeed"} value={undefined}
                       onSetValue={setVibrateAtSpeed}/>
          <SettingsRow label='Dark mode' dataKey={'darkMode'} value={darkMode} isBoolean
                       onSetValue={(value) => {
                         Appearance.setColorScheme(value ? 'dark' : 'light');
                         setDarkMode(value);
                       }}
          />
        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    padding: 10,
    gap: 1,
  },
});
