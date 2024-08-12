import { Alert, NativeEventEmitter, NativeModules, } from 'react-native';
import React, { useState } from "react";
import BleManager from "react-native-ble-manager";
import { Peripheral as RNPeripheral } from "react-native-ble-manager/dist/esm/types";

const SERVICE_UUID = '0000aadb-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000aadc-0000-1000-8000-00805f9b34fb';

interface Peripheral extends RNPeripheral {
  connected?: boolean;
}

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export function useBluetooth() {

  const peripherals = new Map<string, Peripheral>();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Peripheral | null>(null);
  const [discoveredDevices, setDiscoveredDevices] = useState<Peripheral[]>([]);
  const [data, setData] = useState<string | null>(null);

  React.useEffect(() => {
    BleManager.start({ showAlert: true })

    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
        if (peripheral.name === "mpy-uart") {
          connectToPeripheral(peripheral);
        }
      },
    );

    let stopConnectListener = BleManagerEmitter
      .addListener('BleManagerConnectPeripheral', peripheral => console.log('BleManagerConnectPeripheral:', peripheral));

    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => setIsScanning(false),
    );

    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
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

  const connectToPeripheral = (peripheral: Peripheral) => {
    console.log('connecting to', peripheral.name, peripheral.id);

    BleManager.connect(peripheral.id)
      .then(() => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevice(peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
        console.log('BLE device paired successfully');
      })
      .catch((e) => {
        console.log('Failed to connect', e);
      });
  };

  const disconnectFromPeripheral = (peripheral: Peripheral) => {
    setData(null);
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

  const read = () => {
    stopScan();
    if (!connectedDevice) {
      return;
    }
    BleManager.connect(connectedDevice.id)
      .then(() => {
        console.log('connected');
        return BleManager.retrieveServices(connectedDevice.id);
      })
      .then(() => {
        console.log('retrieveServices');
        return BleManager.startNotification(connectedDevice.id, SERVICE_UUID, CHARACTERISTIC_UUID);
      })
      .then(() => {
        return BleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', (data) => {
          // setData(bytesToString(data.value));
          console.log('data', data.value, String.fromCharCode(...data.value));
        })
      })
      .catch((error) => Alert.alert('Error: ' + error));
  }

  return {
    discoveredDevices,
    connectedDevice,
    isScanning,
    startScan,
    stopScan,
    connectToPeripheral,
    disconnectFromPeripheral,
    read,
    data
  };
}
