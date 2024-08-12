import { Settings, Switch, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { ThemedTextInput } from "@/components/ThemedTextInput";

type SettingsRowTextProps = {
  label: string | number;
  dataKey: string;
  value: any;
  onSetValue: (e: any) => void;
  isBoolean?: boolean;
};

export default function SettingsRow({
  label,
  dataKey,
  value,
  onSetValue,
  isBoolean = false
}: SettingsRowTextProps) {
  return (
    <View
      style={{
        alignItems: 'center',

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        height: 40
      }}
    >
      <ThemedText>{label}</ThemedText>
      {isBoolean ? (
        <Switch
          onValueChange={onSetValue}
          value={value}
        />
      ) : (
        <ThemedTextInput
          style={{ height: 30, width: 100, textAlign: 'right' }}
          value={value}
          onChangeText={(text: string) => {
            Settings.set({ [dataKey]: text });
            onSetValue(text);
          }}
          keyboardType="numeric"
          // clearTextOnFocus={true}
          // clearButtonMode="always"
          enterKeyHint={'done'}
        />
      )}
    </View>
  );
}