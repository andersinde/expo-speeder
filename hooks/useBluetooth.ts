import { Settings, } from 'react-native';
import { useState } from "react";

export function useRecordSignal(onReceiveChunk: (chunk: Uint8Array) => void) {

  const [recording, setRecording] = useState<boolean>(false);

  const sampleRate = Settings.get('sampleRate');
  const bitsPerSample = Settings.get('bitsPerSample');
  const bufferSize = Settings.get('bufferSize');

  const [chunk, setChunk] = useState<Uint8Array>(new Uint8Array());
  const isRecordingAllowed = !!sampleRate && !!bitsPerSample && !!bufferSize;

  async function startRecording() {
  }

  async function stopRecording() {
  }

  return { chunk, startRecording, stopRecording, recording, isRecordingAllowed, onReceiveChunk }
}
