import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { format } from "date-fns";

// @ts-ignore
export const SessionRow = ({ log, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SessionEntryScreen', { log });
      }}
      style={styles.container}
    >
      <ThemedView style={styles.text}>
        <ThemedText>{format(log.date, 'yyyy-MM-dd HH:mm')}</ThemedText>
        <ThemedText>Max speed: {Math.max(...log.frequencies).toFixed(2)}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 2,
    padding: 5,
    // backgroundColor: 'red',
  },
  text: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
    // backgroundColor: 'blue',
  }
});
