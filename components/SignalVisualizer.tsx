import React, { useEffect, useRef } from "react";
import Canvas from "react-native-canvas";

type SignalVisualizerProps = {
  signal: number[];
  sampleRate: number;
  peaks: number[];
};

export default function SignalVisualizer({
  signal,
  sampleRate,
  peaks,
}: SignalVisualizerProps) {

  const ref = useRef(null);
  const width = 255;
  const height = 240;

  // const maxValue = Math.max(...signal);
  // const minValue = Math.min(...signal);
  // console.log(signal);

  useEffect(() => {
    if (ref.current) {

      const sliceWidth = width / signal.length;
      // const sliceWidth = 2;
      let x = 0;

      // @ts-ignore
      const context = ref.current.getContext('2d');

      context.lineWidth = 1;
      context.strokeStyle = '#000';
      context.clearRect(0, 0, width, height);

      context.beginPath();
      context.moveTo(0, height / 2);
      for (const item of signal) {
        const y = (item / 255.0) * height;
        context.lineTo(x, y);
        x += sliceWidth;
      }
      // context.lineTo(x, height / 2);
      context.stroke();

      // draw vertical lines
      context.beginPath();
      for (const peak of peaks) {
        context.lineWidth = 1;
        context.strokeStyle = '#ff8b8b';
        context.moveTo(peak * sliceWidth, 0);
        context.lineTo(peak * sliceWidth, height);
      }
      context.stroke();
    }
  }, [ref, signal]);
  // }, [ref]);

  return (
    <>
      <Canvas style={{ width: '100%', height: '100%', backgroundColor: '#ced5e1' }} ref={ref}/>
    </>
  );
}