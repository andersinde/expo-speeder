import React, { useState } from 'react';
import { Button, Settings, Text } from 'react-native';
import { find_peaks, get_frequency_from_peaks, rmsFromChunk } from "@/app/utils";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { StatusBar } from 'expo-status-bar';
import SignalVisualizer from "@/components/SignalVisualizer";
import { useRecordSignal } from "@/hooks/useRecordSignal";

export default function SignalPage() {

  const [showGraph, setShowGraph] = useState<boolean>(false);
  const sampleRate = Settings.get('sampleRate');

  const { chunk, stopRecording, startRecording, isRecordingAllowed, recording } = useRecordSignal();

  const peaks = find_peaks(chunk, undefined, 128 + 10)

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

      <Text>rms: {rmsFromChunk(chunk, 128).toFixed(3)}</Text>
      <Text>Frequency: {get_frequency_from_peaks(peaks, sampleRate).toFixed(2)} Hz</Text>

      <Button
        title={"Log data"}
        onPress={() => {
          console.log(chunk);
          // console.log(detectPeaks(chunk, 50, 128+20));
          // console.log(find_peaks(chunk, 0, 128 + 20));

          // const fft = new FFT(chunk.length);
          // let output = new Float32Array(chunk.length);
          // fft.realTransform(output, chunk)
          // console.log("fft:", fft);
        }}
      />
      {showGraph ? (
        <SignalVisualizer signal={Array.from(chunk)} sampleRate={sampleRate} peaks={peaks}/>
        // <Speedgauge value={get_wheel_speed_kmh(chunk, 80.5, sampleRate)}/>
      ) : null}

    </ParallaxScrollView>
  );
}