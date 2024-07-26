import React from 'react';
import { Text, TextInput, View } from 'react-native';

export type SettingsRowProps = {
  label: string | number;
  value: string | number;
  setValue: (e: any) => void;
};

export function SettingsRow({ label, value, setValue }: SettingsRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Text>{label}</Text>
      <TextInput
        style={{ height: 30, width: 100 }}
        value={typeof value === 'number' ? value.toString() : value}
        onChangeText={(e: any) => setValue(parseInt(e))}
        keyboardType="numeric"
        // clearTextOnFocus={true}
        // clearButtonMode="always"
        enterKeyHint={'done'}
      />
    </View>
  );
}