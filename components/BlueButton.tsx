import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { ThemedText } from "@/components/ThemedText";

interface BlueButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
}

export const BlueButton = ({ onPress, title, style }: BlueButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ ...styles.scanButton, ...style }}>
      <ThemedText style={styles.scanButtonText}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  deviceButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});