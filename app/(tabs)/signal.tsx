import React, { useState } from 'react';
import { Button, Settings, Text } from 'react-native';
import { find_peaks, get_frequency_from_peaks } from "@/app/utils";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { StatusBar } from 'expo-status-bar';
import SignalVisualizer from "@/components/SignalVisualizer";
import { useRecordSignal } from "@/hooks/useRecordSignal";

export default function SignalPage() {

  const [showGraph, setShowGraph] = useState<boolean>(false);
  const sampleRate = Settings.get('sampleRate');
  const peakThreshold = Settings.get('peakThreshold');

  const { chunk, stopRecording, startRecording, isRecordingAllowed, recording } = useRecordSignal();

  const peaks = find_peaks(chunk, peakThreshold);

  return (
    <ParallaxScrollView>
      <StatusBar style="light"/>
      <Button
        disabled={!isRecordingAllowed}
        title={recording ? 'Stop recording' : 'Start recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button
        title={showGraph ? "Hide graph" : "Show graph"}
        onPress={() => {
          setShowGraph(!showGraph)
          // setRecording(false)
        }}
      />

      <Text>Frequency: {get_frequency_from_peaks(peaks, sampleRate).toFixed(2)} Hz</Text>
      <Text>Number of peaks: {peaks.length}</Text>

      <Button
        title={"Log data"}
        onPress={() => {
          console.log(chunk);
        }}
      />
      {showGraph ? (
        <SignalVisualizer signal={Array.from(chunk)} sampleRate={sampleRate} peaks={peaks}/>
      ) : null}

    </ParallaxScrollView>
  );
}
