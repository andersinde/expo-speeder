import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ThemedText } from "@/components/ThemedText";
import { BlueButton } from "@/components/BlueButton";

interface DeviceListProps {
  peripheral: any;
  connect: (peripheral: any) => void;
  disconnect: (peripheral: any) => void;
}

export const DeviceList = ({ peripheral, connect, disconnect }: DeviceListProps) => {
  const { name, connected } = peripheral;
  return (
    <>
      {name && (
        <View style={styles.deviceContainer}>
          {/*<View style={styles.deviceItem}>*/}
            <ThemedText style={styles.deviceName}>{name}</ThemedText>
          {/*</View>*/}
          <BlueButton
            title={connected ? 'Disconnect' : 'Connect'}
            onPress={connected ? () => disconnect(peripheral) : () => connect(peripheral)}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 2,
    // backgroundColor: '#f9f9f9',
    padding: 5,
  },
  // deviceItem: {
    // marginBottom: 10,
    // backgroundColor: 'red',
  // },
  deviceName: {
    fontSize: 17,
    fontWeight: 'bold',
    // backgroundColor: 'blue',
    textAlign: 'center',
  },
  deviceButton: {
    backgroundColor: '#2196F3',
    padding: 7,
    borderRadius: 5,
    // marginBottom: 20,
    // paddingHorizontal: 20,
  },
});
