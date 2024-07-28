import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Speedgauge from "@/components/Speedgauge";
import { useRecordSignal } from "@/hooks/useRecordSignal";

export default function App() {
  const [speed, setSpeed] = useState(0);

  const { stopRecording, startRecording, isRecordingAllowed, recording } = useRecordSignal();

  return (
    <ParallaxScrollView>
      <Button title="expo-speeder!" onPress={() => setSpeed((speed + 10) % 180)}/>
      <Button
        disabled={!isRecordingAllowed}
        title={recording ? 'Stop recording' : 'Start recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <View style={styles.container}>
        <Speedgauge value={speed}/>
      </View>
      <Text style={styles.speed}>{speed.toFixed(1)}</Text>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  speed: {
    fontSize: 84,
    fontWeight: '600',
    textAlign: 'center',
  }
});
