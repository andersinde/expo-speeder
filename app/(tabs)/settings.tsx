import { Appearance, KeyboardAvoidingView, Settings, StyleSheet, useColorScheme } from 'react-native';

import React, { useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import SettingsRow from "@/components/SettingsRow";
import { ThemedView } from "@/components/ThemedView";
import { BlueButton } from "@/components/BlueButton";

interface AppSettings {
  sampleRate: number;
  bitsPerSample: number;
  bufferSize: number;
  maxGauge: number;
  peakThreshold: number;
  copingMode: boolean;
  wheelDiameter: number;
  darkMode: boolean;
}

const defaultSettings: AppSettings = {
  sampleRate: 12000,
  bitsPerSample: 8,
  bufferSize: 4096,
  maxGauge: 100,
  peakThreshold: 128 + 10,
  copingMode: false,
  wheelDiameter: 80,
  darkMode: false,
};

export default function SettingsScreen() {

  // initialize settings with default values if they don't exist
  const [sampleRate, setSampleRate] = useState<number>(() => Settings.get('sampleRate') || defaultSettings.sampleRate);
  const [bitsPerSample, setBitsPerSample] = useState<number>(() => Settings.get('bitsPerSample') ?? defaultSettings.bitsPerSample);
  const [bufferSize, setBufferSize] = useState<number>(() => Settings.get('bufferSize') ?? defaultSettings.bufferSize);
  const [maxGauge, setMaxGauge] = useState<number>(() => Settings.get('maxGauge') ?? defaultSettings.maxGauge);
  const [peakThreshold, setPeakThreshold] = useState<number>(() => Settings.get('peakThreshold') ?? defaultSettings.peakThreshold);
  const [copingMode, setCopingMode] = useState<boolean>(() => Settings.get('copingMode') ?? defaultSettings.copingMode);
  const [wheelDiameter, setWheelDiameter] = useState<number>(() => Settings.get('wheelDiameter') ?? defaultSettings.wheelDiameter);
  const [darkMode, setDarkMode] = useState<boolean>(() => Settings.get('darkMode') ?? defaultSettings.darkMode);

  const theme = useColorScheme() ?? 'light';

  return (
    <ParallaxScrollView>
      <KeyboardAvoidingView>
        <ThemedView
          style={{
            backgroundColor: theme === 'light' ? '#fff' : '#1f2937',
            borderRadius: 4,
            // paddingHorizontal: 40,
            // paddingVertical: 10,
            // width: '100%',
            padding: 10,
            // marginLeft: 0,
            gap: 1,
          }}
        >
          {/*<SettingsRow label={"Sample rate"} dataKey="sampleRate" value={sampleRate} onSetValue={setSampleRate}/>*/}
          {/*<SettingsRow label={"Bits per sample"} dataKey="bitsPerSample" value={bitsPerSample}*/}
          {/*             onSetValue={setBitsPerSample}/>*/}
          {/*<SettingsRow label={"Buffer size"} dataKey="bufferSize" value={bufferSize} onSetValue={setBufferSize}/>*/}
          {/*<SettingsRow label={"Max gauge"} dataKey="maxGauge" value={maxGauge} onSetValue={setMaxGauge}/>*/}
          {/*<SettingsRow label={"Peak threshold"} dataKey="peakThreshold" value={peakThreshold} onSetValue={setPeakThreshold}/>*/}
          <SettingsRow label={"Wheel diameter"} dataKey="wheelDiameter" value={wheelDiameter}
                       onSetValue={setWheelDiameter}/>
          <SettingsRow label={"Coping mode"} dataKey="copingMode" value={copingMode}
                       onSetValue={setCopingMode} isBoolean/>
          <SettingsRow label={'Dark mode'} dataKey={'darkMode'} value={darkMode} isBoolean
                       onSetValue={(value) => {
                         Appearance.setColorScheme(value ? 'dark' : 'light');
                         setDarkMode(value);
                       }}
          />
        </ThemedView>
      </KeyboardAvoidingView>
      <BlueButton
        title="Restore to default"
        onPress={() => {
          // Settings.set(defaultSettings);
          console.log(Settings.get("peakThreshold"));
        }}
      />
    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#c8dde7',
    padding: 10,
    // alignItems: 'center',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    padding: 10,
  },
});
