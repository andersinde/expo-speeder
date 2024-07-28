/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Settings, } from 'react-native';
import { useState } from "react";
import { Audio } from "expo-av";
import { Buffer } from "buffer";
import LiveAudioStream from "react-native-live-audio-stream";

export function useRecordSignal() {

  const [recording, setRecording] = useState<boolean>(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const sampleRate = Settings.get('sampleRate');
  const bitsPerSample = Settings.get('bitsPerSample');
  const bufferSize = Settings.get('bufferSize');

  const [chunk, setChunk] = useState<Buffer>(Buffer.alloc(0));
  const [frequency, setFrequency] = useState<number>(0);
  const isRecordingAllowed = !!sampleRate && !!bitsPerSample && !!bufferSize;

  async function startRecording() {
    setRecording(true);
    // setShowGraph(false);
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
        // console.log("chunk:", chunk);
        setChunk(chunk);
      });
      LiveAudioStream.start();
    } catch (err) {
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(false);
    await LiveAudioStream.stop();
  }

  return { chunk, startRecording, stopRecording, recording, isRecordingAllowed }
}
