import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { RadialSlider } from 'react-native-radial-slider';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function App() {
  const [speed, setSpeed] = useState(0);

  return (
    <ParallaxScrollView>
      <Button title="expo-speeder!" onPress={() => setSpeed(speed === 0 ? 120 : 0)}/>
      <View style={styles.container}>
        <RadialSlider
          variant="speedometer-marker"
          value={speed}
          min={0}
          max={200}
          // onChange={setSpeed}
          radius={100}
          unit="km/h"
          unitValueContentStyle={{ backgroundColor: "#aaa", borderRadius: 10}}
          // needleColor={"#8a4b4b"}
          needleBorderWidth={0}
          lineColor={"#aaa"}
          sliderTrackColor={"#ddd"}
          linearGradient={[ { offset: '0%', color:'#100c09' }, { offset: '100%', color: '#484544' }]}
          // needleBackgroundColor
          // markerValueInterval={10}
          // markerValueColor
          // strokeLinecap="round"
        />
      </View>
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
});
