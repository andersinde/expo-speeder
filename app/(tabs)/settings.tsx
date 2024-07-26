import { KeyboardAvoidingView, Settings, StyleSheet, useColorScheme } from 'react-native';

import React, { useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import SettingsRowText from "@/components/SettingsRowText";
import { ThemedView } from "@/components/ThemedView";


export default function SettingsScreen() {

  const [sampleRate, setSampleRate] = useState(() => Settings.get('sampleRate'));
  const [bitsPerSample, setBitsPerSample] = useState(() => Settings.get('bitsPerSample'));
  const [bufferSize, setBufferSize] = useState(() => Settings.get('bufferSize'));
  const [copingMode, setCopingMode] = useState<boolean>(false);
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
          <SettingsRowText label={"Sample rate"} dataKey="sampleRate" value={sampleRate} onSetValue={setSampleRate}/>
          <SettingsRowText label={"Bits per sample"} dataKey="bitsPerSample" value={bitsPerSample}
                           onSetValue={setBitsPerSample}/>
          <SettingsRowText label={"Buffer size"} dataKey="bufferSize" value={bufferSize} onSetValue={setBufferSize}/>
          <SettingsRowText label={"Coping mode"} dataKey="copingMode" value={copingMode}
                           onSetValue={setCopingMode} isBoolean/>
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
