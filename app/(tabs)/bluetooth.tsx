import React from 'react';
import { Button, StyleSheet, } from 'react-native';
import ThemedScrollView from "@/components/ThemedScrollView";
import { DeviceList } from "@/components/DeviceList";
import { ThemedText } from "@/components/ThemedText";
import { useBluetooth } from "@/hooks/useBluetooth";
import { BlueButton } from "@/components/BlueButton";
import { ThemedView } from "@/components/ThemedView";

function BluetoothPage() {

  const {
    discoveredDevices,
    connectedDevice,
    isScanning,
    startScan,
    stopScan,
    disconnectFromPeripheral,
    connectToPeripheral,
    sensorValue,
  } = useBluetooth();

  return (
    <>
      <ThemedScrollView>
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
          <ThemedText style={styles.noDevicesText}>No connected device</ThemedText>
        )}
        <ThemedText>{sensorValue}</ThemedText>
      </ThemedScrollView>
      <ThemedView style={styles.scanButton}>
        <BlueButton
          title={isScanning ? 'Stop scanning' : 'Scan Bluetooth Devices'}
          onPress={isScanning ? stopScan : startScan}
          style={{ padding: 22 }}
        />
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  noDevicesText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  scanButton: {
    padding: 16,
    paddingBottom: 24
  }
});
