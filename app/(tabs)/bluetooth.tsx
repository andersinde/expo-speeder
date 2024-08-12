import React from 'react';
import { Button, StyleSheet, } from 'react-native';
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { DeviceList } from "@/components/DeviceList";
import { ThemedText } from "@/components/ThemedText";
import { useBluetooth } from "@/hooks/useBluetooth";
import { BlueButton } from "@/components/BlueButton";

export default function BluetoothPage() {

  const {
    discoveredDevices,
    connectedDevice,
    isScanning,
    startScan,
    stopScan,
    connectToPeripheral,
    disconnectFromPeripheral,
    read,
    data
  } = useBluetooth();

  return (
    <ParallaxScrollView>
      <BlueButton
        title={isScanning ? 'Stop scanning' : 'Scan Bluetooth Devices'}
        onPress={isScanning ? stopScan : startScan}
      />
      {discoveredDevices.length > 0 && isScanning ?
        discoveredDevices.map((item) => (
            <DeviceList
              peripheral={item}
              connect={connectToPeripheral}
              disconnect={disconnectFromPeripheral}
              key={item.id}
            />
          )
        ) : null}
      <ThemedText>Connected Device:</ThemedText>
      {connectedDevice ? (
        <DeviceList
          peripheral={connectedDevice}
          connect={connectToPeripheral}
          disconnect={disconnectFromPeripheral}
          key={connectedDevice.id}
        />
      ) : (
        <ThemedText style={styles.noDevicesText}>No connected devices</ThemedText>
      )}
      <Button disabled={!connectedDevice} title="Read data" onPress={read}/>
      <ThemedText>{data}</ThemedText>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  noDevicesText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
