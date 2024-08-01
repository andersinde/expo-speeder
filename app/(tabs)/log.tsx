import { Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { format } from "date-fns";
import { ThemedView } from "@/components/ThemedView";

export interface LogEntry {
  date: string;
  frequencies: number[];
  wheelDiameter: number;
}

const SessionRow = ({ log }: { log: LogEntry }) => {
  console.log("log", log);
  return (
    <TouchableOpacity onPress={() => {
    }} style={{ margin: 2, padding: 16, backgroundColor: "#e5e5e5" }}>
      <ThemedText>{format(log.date, 'yyyy-MM-dd hh:mm')}</ThemedText>
      <ThemedText>Max speed: {Math.max(...log.frequencies).toFixed(2)}</ThemedText>
    </TouchableOpacity>
  );
}

export default function LogScreen() {

  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const getAllLogs = async () => {
    setRefreshing(true);
    let keys: readonly string[] = []
    try {
      keys = await AsyncStorage.getAllKeys()
      setRefreshing(false);
    } catch (e) {
    }

    let newLogs: LogEntry[] = [];

    for (const key of keys) {
      if (key.startsWith('speed-session-')) {
        const value = await AsyncStorage.getItem(key)
        if (value === null) {
          continue;
        }
        newLogs.push(JSON.parse(value));
      }
    }
    setLogs(newLogs);
  }

  const deleteAllKeys = async () => {
    try {
      await AsyncStorage.clear()
    } catch (e) {
    }
  }

  return (
    <ThemedView>
      <Button title={'Get all'} onPress={getAllLogs}/>
      <Button title={'Delete all'} onPress={deleteAllKeys}/>
      {logs.length === 0 ? <ThemedText>No logs</ThemedText> : null}
      <FlatList
        data={logs}
        renderItem={({ item }) => <SessionRow log={item}/>}
        keyExtractor={item => item.date}
        onRefresh={getAllLogs}
        refreshing={refreshing}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
