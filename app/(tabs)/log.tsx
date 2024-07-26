import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function LogScreen() {
  return (
    <ParallaxScrollView>
    </ParallaxScrollView>
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
