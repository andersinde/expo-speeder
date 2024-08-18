import React from 'react';
import { Settings, StyleSheet, View } from 'react-native';
import ThemedScrollView from '@/components/ThemedScrollView';
import { get_wheel_speed_kmh_from_frequency } from "@/app/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogEntry } from "@/app/(tabs)/log";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemedText } from "@/components/ThemedText";
import { BlueButton } from "@/components/BlueButton";
import { ThemedView } from "@/components/ThemedView";
import { useBluetooth } from "@/hooks/useBluetooth";

const Stack = createNativeStackNavigator()

const App = () => {
  const [_speed, setSpeed] = React.useState<number>(0);
  const [previousSpeed, setPreviousSpeed] = React.useState(0);
  // const [txId, setTxId] = React.useState<Number>(-1);

  const onReceiveData = (data: String, _: Number) => {
    const _speed = get_wheel_speed_kmh_from_frequency(Number(data), Settings.get('wheelDiameter'))
    console.log("onReceiveData", data, _speed);
    setPreviousSpeed(speed);
    setSpeed(_speed ? _speed : 0);
  }

  const {
    connectedDevice,
    connectToPeripheral,
    discoveredDevices,
    isScanning,
    startScan,
    stopScan,
    sensorValue,
    startRecording,
    stopRecording,
    isRecording,
    savedRecording,
  } = useBluetooth(onReceiveData);

  const potentialPreferredDevices = discoveredDevices.filter(device => device.name === Settings.get('preferredDevice'))
  const wheelDiameter = Settings.get('wheelDiameter');
  const preferredDevice = potentialPreferredDevices.length > 0 ? potentialPreferredDevices[0] : null;
  const speed = sensorValue ? get_wheel_speed_kmh_from_frequency(sensorValue, wheelDiameter) : 0;

  const stopSession = async () => {
    stopRecording();

    try {
      const log: LogEntry = {
        date: new Date().toISOString(),
        frequencies: savedRecording.map(frequency => get_wheel_speed_kmh_from_frequency(frequency, wheelDiameter)),
        wheelDiameter: Number(Settings.get('wheelDiameter')),
      };
      const jsonValue = JSON.stringify(log);
      console.log('saving session', log)
      await AsyncStorage.setItem('speed-session-' + log.date, jsonValue);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <ThemedScrollView style={{ padding: 0 }} scrollEnabled={false}>
        <View style={styles.speedContainer}>
          {/*<ThemedText style={styles.speedNumber}>{(111.10).toFixed(1)}</ThemedText>*/}
          <ThemedText style={styles.speedNumber}>
            {connectedDevice ? speed.toFixed(1) : "-"}
            {/*{sensorValue ? sensorValue : "-"}*/}
          </ThemedText>
          <ThemedText style={styles.speedUnit}>km/h</ThemedText>
        </View>
      </ThemedScrollView>
      {preferredDevice ? (
        <ThemedView style={styles.startButton}>
          <BlueButton
            title={preferredDevice ? "Connect to " + preferredDevice.name : "-"}
            onPress={preferredDevice ? () => connectToPeripheral(preferredDevice) : () => {
            }}
            style={{ padding: 22 }}
          />
        </ThemedView>
      ) : null}
      {!preferredDevice ? (
        <ThemedView style={styles.startButton}>
          <BlueButton
            title={isScanning ? 'Stop scanning' : 'Scan Bluetooth Devices'}
            onPress={isScanning ? stopScan : startScan}
            style={{ padding: 22 }}
          />
        </ThemedView>
      ) : null}
      <ThemedView style={styles.startButton}>
        <BlueButton
          // disabled={sensorValue != null}
          title={isRecording ? 'Stop session' : 'Start session'}
          onPress={isRecording ? stopSession : startRecording}
          style={{ padding: 22 }}
        />
      </ThemedView>
    </>
  );
}

export default function HomeBaseView() {
  return (
    <NavigationContainer independent>
      <Stack.Navigator>
        <Stack.Screen
          name="Logs"
          component={App}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  speedContainer: {
    paddingTop: 80,
    verticalAlign: 'bottom',
  },
  speedNumber: {
    fontFamily: 'MonomaniacOneRegular',
    fontSize: 150,
    textAlign: 'center',
    lineHeight: 160,
  },
  speedUnit: {
    fontFamily: 'MonomaniacOneRegular',
    fontSize: 50,
    lineHeight: 60,
    textAlign: 'right',
    paddingHorizontal: 10,
  },
  startButton: {
    padding: 16,
    paddingBottom: 24
  }
});
