import React from 'react';
import { Button, Settings, StyleSheet, Text, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Speedgauge from "@/components/Speedgauge";
import { useRecordSignal } from "@/hooks/useRecordSignal";
import { get_wheel_speed_kmh } from "@/app/utils";

export default function App() {
  const sampleRate = Settings.get('sampleRate');

  const { chunk, stopRecording, startRecording, isRecordingAllowed, recording } = useRecordSignal();

  const speed = get_wheel_speed_kmh(chunk, Settings.get('wheelDiameter'), sampleRate);

  // const [savedData, setSavedData] = useState<float[]>([]);

  return (
    <ParallaxScrollView>
      <Button
        disabled={!isRecordingAllowed}
        title={recording ? 'Stop recording' : 'Start recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <View style={styles.container}>
        <Speedgauge value={speed.toFixed(1)}/>
      </View>
      <Text style={styles.speed}>{speed.toFixed(1)} km/h</Text>
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
    fontSize: 55,
    fontWeight: '600',
    textAlign: 'center',
  }
});
