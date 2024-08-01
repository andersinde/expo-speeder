import React from 'react';
import { Button, Settings, StyleSheet, Text, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Speedgauge from "@/components/Speedgauge";
import { useRecordSignal } from "@/hooks/useRecordSignal";
import { get_wheel_speed_kmh } from "@/app/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogEntry } from "@/app/(tabs)/log";

export default function App() {
  const sampleRate = Settings.get('sampleRate');
  const peakThreshold = Settings.get('peakThreshold');
  const [isRecordingSession, setIsRecordingSession] = React.useState(false);
  const [savedRecording, setSavedRecording] = React.useState<number[]>([]);
  const [speed, setSpeed] = React.useState<number>(0);

  function onReceiveChunk(chunk: Uint8Array) {
    const _speed = get_wheel_speed_kmh(chunk, Settings.get('wheelDiameter'), sampleRate, peakThreshold);
    setSpeed(_speed);

    setSavedRecording(prevSavedRecording => [...prevSavedRecording, _speed]);
  }

  const { stopRecording, startRecording, isRecordingAllowed } = useRecordSignal(onReceiveChunk);

  const startSession = () => {
    console.log('Session started');
    startRecording().then(() => setIsRecordingSession(true));
  }

  const stopSession = async () => {
    console.log('Session stopped');
    await stopRecording();
    setIsRecordingSession(false);

    try {
      const log: LogEntry = {
        date: new Date().toISOString(),
        frequencies: savedRecording,
        wheelDiameter: Number(Settings.get('wheelDiameter')),
      };
      const jsonValue = JSON.stringify(log);
      console.log('saving session');
      await AsyncStorage.setItem('speed-session-' + log.date, jsonValue);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ParallaxScrollView>
      <Button
        disabled={!isRecordingAllowed}
        title={isRecordingSession ? 'Stop session' : 'Start session'}
        onPress={isRecordingSession ? stopSession : startSession}
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
