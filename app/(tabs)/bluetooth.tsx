import React, { useState } from 'react';
import {
  Alert, Button,
  Dimensions,
  NativeEventEmitter,
  NativeModules,
  SafeAreaView,
  StyleSheet,
  Text, TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import BleManager, { Peripheral as RNPeripheral } from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { StatusBar } from "expo-status-bar";
import { DeviceList } from "@/components/DeviceList";
import { ThemedText } from "@/components/ThemedText";

const SERVICE_UUID = '0000aadb-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000aadc-0000-1000-8000-00805f9b34fb';

interface Peripheral extends RNPeripheral {
  connected?: boolean;
}

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const windowHeight = Dimensions.get('window').height;

export default function BluetoothPage() {
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

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter, };

  return (
    <ParallaxScrollView>
      <StatusBar style={isDarkMode ? 'light' : 'dark'}/>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.scanButton}
        onPress={isScanning ? stopScan : startScan}>
        <Text style={styles.scanButtonText}>
          {isScanning ? 'Stop scanning' : 'Scan Bluetooth Devices'}
        </Text>
      </TouchableOpacity>
      {/*<ThemedText> Discovered Devices: </ThemedText>*/}
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
  container: {
    flex: 1,
    height: windowHeight,
    paddingHorizontal: 10,
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 10,
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  noDevicesText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deviceItem: {
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  deviceInfo: {
    fontSize: 14,
  },
  deviceButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
