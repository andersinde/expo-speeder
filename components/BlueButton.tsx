import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { ThemedText } from "@/components/ThemedText";

interface BlueButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
}

export const BlueButton = ({ onPress, title, style, disabled }: BlueButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.button, ...style }}
      disabled={disabled}>
      <ThemedText style={styles.buttonText}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  scanButtonDisabled: {
    backgroundColor: '#ccf',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});