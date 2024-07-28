import React from "react";

import Speedometer, { Arc, Background, Marks, Needle, Progress, } from 'react-native-cool-speedometer';

import { Settings } from "react-native";

type SpeedgaugeProps = {
  value: any;
};

export default function Speedgauge({
  value,
}: SpeedgaugeProps) {
  // const width = 250;
  const maxValue = Settings.get('maxGague')

  return (
    <Speedometer
      value={value}
      // width={width}
      max={maxValue}
      // angle={200}
      fontFamily='squada-one'
      accentColor="#aaa"
    >
      <Background angle={280} color={"#181313"}/>
      <Arc/>
      <Needle color={"#bbb"}/>
      <Progress/>
      <Marks step={5}/>
      {/*<Indicator fixValue={true} color={"#000"}/>*/}
      {/*<Indicator fixValue={false}>*/}
      {/*  {(fixedValue, textProps) => (*/}
      {/*    <ThemedText {...textProps}>{parseFloat(fixedValue).toFixed(1)}</ThemedText>*/}
      {/*  )}*/}
      {/*</Indicator>*/}
    </Speedometer>
  );
}