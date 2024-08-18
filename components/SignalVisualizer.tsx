import React from "react";
import { LineChart } from "react-native-gifted-charts";
import { CurveType } from "gifted-charts-core";

type SignalVisualizerProps = {
  signal: number[];
};

export default function SignalVisualizer({
  signal,
}: SignalVisualizerProps) {

  const maxValue = Math.max(...signal);

  const lineChartData = signal.map((value) =>
    ({ value, dataPointText: value === maxValue ? value.toFixed(2) : '' }
    ));

  return (
    <LineChart
      data={lineChartData}
      // areaChart

      // data={data}
      color="black"
      thickness={4}

      width={220}
      height={200}
      // spacing={spacing > 0 ? spacing : 1}

      curveType={CurveType.QUADRATIC}

      dataPointsColor='black'
      isAnimated

      // hideDataPoints
      // showVerticalLines
      // disableScroll
      // yAxisColor="#0BA5A4"
      // showVerticalLines
      // verticalLinesColor="rgba(14,164,164,0.5)"
      // xAxisColor="#0BA5A4"

      // pointerConfig={{
      //   pointerStripUptoDataPoint: true,
      //   pointerStripColor: 'lightgray',
      //   pointerStripWidth: 2,
      //   strokeDashArray: [2, 5],
      //   pointerColor: 'lightgray',
      //   radius: 4,
      //   pointerLabelWidth: 100,
      //   pointerLabelHeight: 120,
      //   pointerLabelComponent: (items: any) => {
      //     console.log(items)
      //     return (
      //       <View
      //         style={{
      //           height: 120,
      //           width: 100,
      //           backgroundColor: '#282C3E',
      //           borderRadius: 4,
      //           justifyContent: 'center',
      //           paddingLeft: 16,
      //         }}>
      //         <Text style={{ color: 'white', fontWeight: 'bold' }}>{items[0]}</Text>
      //         {/*<Text style={{ color: 'lightgray', fontSize: 12, marginTop: 12 }}>{2019}</Text>*/}
      //         {/*<Text style={{ color: 'white', fontWeight: 'bold' }}>{items[1].value}</Text>*/}
      //       </View>
      //     )
      //   }
      // }}
    />
    // </ThemedView>
  );
}