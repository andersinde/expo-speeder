import { Button, StyleSheet, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from "react";
import { SessionRow } from "@/components/SessionRow";
import { SessionEntryScreen } from "@/components/SessionEntryScreen";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ThemedScrollView from "@/components/ThemedScrollView";
import { Colors } from "@/constants/Colors";

const Stack = createNativeStackNavigator();

export interface LogEntry {
  date: string;
  frequencies: number[];
  wheelDiameter: number;
}

const EXAMPLE_LOG_ENTRY = {
  date: '2021-09-01T12:00:00.000Z',
  frequencies: [1, 2, 3, 4, 5],
  wheelDiameter: 80,
}

// @ts-ignore
const LogView = ({ navigation }) => {

  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  // const logs = [EXAMPLE_LOG_ENTRY, EXAMPLE_LOG_ENTRY, EXAMPLE_LOG_ENTRY, EXAMPLE_LOG_ENTRY, EXAMPLE_LOG_ENTRY, EXAMPLE_LOG_ENTRY, EXAMPLE_LOG_ENTRY
  // , EXAMPLE_LOG_ENTRY, EXAMPLE_LOG_ENTRY, EXAMPLE_LOG_ENTRY, EXAMPLE_LOG_ENTRY, EXAMPLE_LOG_ENTRY, EXAMPLE_LOG_ENTRY, EXAMPLE_LOG_ENTRY];
  const [refreshing, setRefreshing] = React.useState(false);

  // React.useEffect(() => {
  //   getAllLogs();
  // }, []);

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

  return (
    <ThemedScrollView style={{padding: 0, paddingTop: 0}}>
      {logs.map((log) => <SessionRow key={log.date} log={log} navigation={navigation}/>)}
      {/*({ item }) => <SessionRow log={item} navigation={navigation}/>}*!/*/}
      {/*<FlatList*/}
      {/*  data={logs}*/}
      {/*  renderItem={({ item }) => <SessionRow log={item} navigation={navigation}/>}*/}
      {/*  keyExtractor={item => item.date}*/}
      {/*  onRefresh={getAllLogs}*/}
      {/*  refreshing={refreshing}*/}
      {/*/>*/}
      <Button title={'Load data'} onPress={getAllLogs}/>
    </ThemedScrollView>
  );
}

export default function LogBaseView() {
  const theme = useColorScheme() ?? 'light';
  return (
    <NavigationContainer independent>
      <Stack.Navigator>
        <Stack.Screen
          name="Logs"
          component={LogView}
          options={{
            // headerShown: false,
            headerRight: () => (
              <Button color="#f55" title={'Delete all'} onPress={async () => {
                await AsyncStorage.clear();
              }}/>
            ),
            headerStyle: {
              backgroundColor: theme === 'light' ? Colors.light.background : DarkTheme.colors.card
          },
            headerTitleStyle: {
              color: theme === 'light' ? Colors.light.text : Colors.dark.text
            },
          }}
        />
        <Stack.Screen name="SessionEntryScreen" component={SessionEntryScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}