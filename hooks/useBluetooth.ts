import { Alert, Settings, } from 'react-native';
import React, { useContext, useState } from "react";
import BleManager from "react-native-ble-manager";
import { Peripheral as RNPeripheral } from "react-native-ble-manager/dist/esm/types";
import { BlueToothContext } from "@/app/_layout";

const SERVICE_UUID = '0000aadb-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000aadc-0000-1000-8000-00805f9b34fb';
const DEVICE_PREFIX = 'Pico';

interface Peripheral extends RNPeripheral {
  connected?: boolean;
}

export function useBluetooth(onReceiveData?: (value: any, tx_id: number) => void) {

  const peripherals = new Map<string, Peripheral>();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Peripheral | null>(null);
  const [discoveredDevices, setDiscoveredDevices] = useState<Peripheral[]>([]);
  const [savedRecording, setSavedRecording] = useState<number[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const { sensorValue, setSensorValue, BleManagerEmitter } = useContext(BlueToothContext);

  React.useEffect(() => {
    BleManager.start({ showAlert: true })

    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (peripheral: Peripheral) => {
        console.log("BleManagerDiscoverPeripheral");
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values())
          .filter(p => p.name && p.name.startsWith(DEVICE_PREFIX)));
      },
    );

    let disconnectListener = BleManagerEmitter
      .addListener('BleManagerDisconnectPeripheral', peripheral => console.log("Disconnected from", peripheral.name));

    let stopConnectListener = BleManagerEmitter
      .addListener('BleManagerConnectPeripheral', peripheral => console.log('BleManagerConnectPeripheral:', peripheral));

    // let stopScanListener = BleManagerEmitter
    //   .addListener('BleManagerStopScan', () => setIsScanning(false));
    //
    // let updateStateListener = BleManagerEmitter
    //   .addListener('BleManagerDidUpdateState', (value) => console.log("BleManagerDidUpdateState", value));

    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      // stopScanListener.remove();
      disconnectListener.remove();
      // updateStateListener.remove();
    };
  }, []);

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 4, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const stopScan = () => {
    BleManager.stopScan()
      .then(() => {
        console.log('Scan stopped');
        setIsScanning(false);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const disconnectFromPeripheral = (peripheral: Peripheral) => {
    setSensorValue(null);
    BleManager.disconnect(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevice(null);
      })
      .catch(() => {
        console.error('Failed to disconnect');
      });
  };

  const connectToPeripheral = (peripheral: Peripheral) => {
    Settings.set({ "preferredDeviceId": peripheral.id });

    if (isScanning) {
      stopScan();
    }
    console.log('read from', peripheral.id);
    BleManager.connect(peripheral.id)
      .then(() => {
        console.log('(read) connected to deviceId');
        return BleManager.retrieveServices(peripheral.id);
      })
      .then(() => BleManager.startNotification(peripheral.id, SERVICE_UUID, CHARACTERISTIC_UUID))
      .then(() => {
        return BleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', (data) => {
          const value = String.fromCharCode(...data.value);
          const frequency = Number(value.split("_")[0]);
          const tx_id = Number(value.split("_")[1]);
          setSensorValue(frequency);
          onReceiveData?.(frequency, tx_id);
          setConnectedDevice(peripheral);
          peripheral.connected = true;
          setSavedRecording(prevSavedRecording => [...prevSavedRecording, frequency]);
        })
      })
      .catch((error) => Alert.alert('Error: ' + error));
  }

  const startRecording = () => {
    setSavedRecording([]);
    setIsRecording(true);
  }

  const stopRecording = () => {
    setIsRecording(false);
  }

  return {
    discoveredDevices,
    connectedDevice,
    isScanning,
    startScan,
    stopScan,
    disconnectFromPeripheral,
    connectToPeripheral,
    sensorValue,
    startRecording,
    stopRecording,
    isRecording,
    savedRecording
  };
}
