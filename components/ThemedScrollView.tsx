import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedRef, } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';

type Props = PropsWithChildren<{
  style?: any;
  scrollEnabled?: boolean;
}>;

export default function ThemedScrollView({
  children,
  style,
  scrollEnabled = true,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} scrollEnabled={scrollEnabled}>
        <ThemedView style={{...styles.content, ...style}}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 32,
    overflow: 'hidden',
    paddingTop: 70
  },
});
