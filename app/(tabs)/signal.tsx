import React, { useState } from 'react';
import { Button, StyleSheet, Switch, Text, TextInput, View, ScrollView, Settings } from 'react-native';
import { Buffer } from 'buffer';
import LiveAudioStream from 'react-native-live-audio-stream';
import { Audio } from 'expo-av';
import { LineChart } from "react-native-gifted-charts";
import { SettingsRow } from "@/components/SettingsRow";
import { lineDataFromChunk } from "@/app/utils";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { StatusBar } from 'expo-status-bar';

export default function SignalPage() {
  const [recording, setRecording] = useState<boolean>(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const sampleRate = Settings.get('sampleRate');
  const bitsPerSample = Settings.get('bitsPerSample');
  const bufferSize = Settings.get('bufferSize');

  const [hasError, setHasError] = useState<boolean>(false);
  const [rpm, setRpm] = useState<number>(0);
  const [chunk, setChunk] = useState<Buffer>(Buffer.alloc(0));
  const [signalData, setSignalData] = useState<any[]>([]);
  const [showGraph, setShowGraph] = useState<boolean>(false);
  const [spacing, setSpacing] = useState<number>(10);

  const isRecordingAllowed = sampleRate && bitsPerSample && bufferSize;


  async function startRecording() {
    setRecording(true);
    setShowGraph(false);
    console.log('Recording started');

    if (permissionResponse?.status !== 'granted') {
      console.log('Requesting permission..');
      await requestPermission();
    }

    const options = {
      // number of times the audio is captured per second.
      // default is 44100 but 32000 is adequate for accurate voice recognition
      sampleRate,
      channels: 1,       // 1 or 2, default 1
      bitsPerSample,  // 8 or 16, default 16
      // length of the chunk
      // the number of samples (which corresponds to the amount of time) it takes for your computer to process an audio signal
      bufferSize,   // default is 2048
      wavFile: '_.wav'
    };

    try {
      LiveAudioStream.init(options);
      LiveAudioStream.on('data', data => { // data is base64-encoded audio data chunks

        const chunk = Buffer.from(data, 'base64');
        // console.log("time:", format(new Date(), 'HH:mm:ss.SSS'));
        // console.log("chunk:", chunk.length);
        // console.log(lineDataFromChunk(chunk));
        setSignalData(lineDataFromChunk(chunk));
        // setRpm(rpmFromChunk(chunk));
        // setChunk(chunk);
        // console.log(lineDataFromChunk(chunk));
      });
      LiveAudioStream.start();

      setHasError(false);
    } catch (err) {
      console.error('Failed to start recording', err);
      setHasError(true);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(false);
    await LiveAudioStream.stop();
  }

  return (
    <ParallaxScrollView>
      <StatusBar style="auto" />
      <Button
        disabled={!isRecordingAllowed}
        title={recording ? 'Stop recording' : 'Start recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button
        title={showGraph ? "Hide graph" : "Show graph"}
        onPress={() => {
          setShowGraph(!showGraph)
          setRecording(false)
        }}
      />
      <View
        style={{
          backgroundColor: "#8795b0",
          borderRadius: 4,
          paddingHorizontal: 40,
          paddingVertical: 10,
          gap: 1,
        }}
      >
        <SettingsRow label="Sample rate" value={sampleRate} setValue={() => {}}/>
        <SettingsRow label="Bits per sample" value={bitsPerSample} setValue={() => {}}/>
        <SettingsRow label="Buffer size" value={bufferSize} setValue={() => {}}/>
        <SettingsRow label="Graph spacing" value={spacing} setValue={setSpacing}/>
      </View>

      {hasError ? (
        <Text style={{ color: 'red' }}>An error occurred</Text>
      ) : null}

      {/*<Text>{rpm} rpm</Text>*/}

      {showGraph && signalData.length > 0 ? (
        <LineChart
          data={signalData}
          // data={data}
          color="#177AD5"
          thickness={2}

          width={230}
          height={200}
          spacing={spacing > 0 ? spacing : 1}
          // dataPointsColor={'red'}
          hideDataPoints
          // showVerticalLines
          // disableScroll
        />) : null}
    </ParallaxScrollView>
  );
}