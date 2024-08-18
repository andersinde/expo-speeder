import { Settings, Switch, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { ThemedTextInput } from "@/components/ThemedTextInput";

type SettingsRowTextProps = {
  label: string | number;
  dataKey: string;
  value: any;
  onSetValue: (value: any) => void;
  isBoolean?: boolean;
  keyboardType?: "numeric" | "email-address" | "phone-pad" | "default";
};

export default function SettingsRow({
  label,
  dataKey,
  value,
  onSetValue,
  isBoolean = false,
  keyboardType = "numeric"
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
          onValueChange={(newValue) => {
            Settings.set({ [dataKey]: newValue });
            onSetValue(newValue)
          }}
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
          keyboardType={keyboardType}
          // clearTextOnFocus={true}
          // clearButtonMode="always"
          enterKeyHint={'done'}
        />
      )}
    </View>
  );
}