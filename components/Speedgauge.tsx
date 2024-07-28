import React from "react";

import Speedometer, { Arc, Background, Indicator, Marks, Needle, Progress, } from 'react-native-cool-speedometer';

// import { Text } from 'react-native-svg'
import { ThemedText } from "@/components/ThemedText";

type SpeedgaugeProps = {
  value: any;
};

export default function Speedgauge({
  value,
}: SpeedgaugeProps) {
  const width = 250;

  return (
    <Speedometer
      value={value}
      // width={width}
      max={180}
      // angle={200}
      fontFamily='squada-one'
      accentColor="#aaa"
    >
      <Background angle={280} color={"#181313"}/>
      <Arc/>
      <Needle color={"#bbb"}/>
      <Progress/>
      <Marks/>
      {/*<Indicator fixValue={true} color={"#000"}/>*/}
      {/*<Indicator fixValue={false}>*/}
      {/*  {(fixedValue, textProps) => (*/}
      {/*    <ThemedText {...textProps}>{parseFloat(fixedValue).toFixed(1)}</ThemedText>*/}
      {/*  )}*/}
      {/*</Indicator>*/}
    </Speedometer>
  );
}