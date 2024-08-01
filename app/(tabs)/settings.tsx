import { Appearance, KeyboardAvoidingView, Settings, StyleSheet, useColorScheme } from 'react-native';

import React, { useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import SettingsRow from "@/components/SettingsRow";
import { ThemedView } from "@/components/ThemedView";


export default function SettingsScreen() {

  const [sampleRate, setSampleRate] = useState(() => Settings.get('sampleRate'));
  const [bitsPerSample, setBitsPerSample] = useState(() => Settings.get('bitsPerSample'));
  const [bufferSize, setBufferSize] = useState(() => Settings.get('bufferSize'));
  const [maxGauge, setMaxGauge] = useState(() => Settings.get('maxGauge'));
  const [peakThreshold, setPeakThreshold] = useState(() => Settings.get('peakThreshold') || 128+10);
  const [copingMode, setCopingMode] = useState<boolean>(false);
  const [wheelDiameter, setWheelDiameter] = useState(() => Settings.get('wheelDiameter'));
  const [darkMode, setDarkMode] = useState<boolean>(false);
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
          <SettingsRow label={"Sample rate"} dataKey="sampleRate" value={sampleRate} onSetValue={setSampleRate}/>
          <SettingsRow label={"Bits per sample"} dataKey="bitsPerSample" value={bitsPerSample}
                       onSetValue={setBitsPerSample}/>
          <SettingsRow label={"Buffer size"} dataKey="bufferSize" value={bufferSize} onSetValue={setBufferSize}/>
          <SettingsRow label={"Max gauge"} dataKey="maxGauge" value={maxGauge} onSetValue={setMaxGauge}/>
          <SettingsRow label={"Peak threshold"} dataKey="peakThreshold" value={peakThreshold} onSetValue={setPeakThreshold}/>
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
