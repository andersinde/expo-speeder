import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { format } from "date-fns";
import SignalVisualizer from "@/components/SignalVisualizer";
import { StyleSheet } from "react-native";

// @ts-ignore
export const SessionEntryScreen = ({ navigation, route }) => {
  const log = route.params.log;
  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedText>{format(log.date, 'yyyy-MM-dd HH:mm')}</ThemedText>
        <ThemedText>Max speed: {Math.max(...log.frequencies).toFixed(2)}</ThemedText>
      </ThemedView>
      <SignalVisualizer signal={log.frequencies}/>
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    // backgroundColor: 'red'
  }
});