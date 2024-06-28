import React from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('screen');

const Pagination = ({ data, scrollX }) => {
  return (
    <View style={styles.container}>
      {data.map((_: any, idx: number) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 46, 8],
          extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['#82828B', '#2665EF', '#82828B'],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={idx.toString()}
            style={[styles.dot, { width: dotWidth, backgroundColor }]}
          />
        );
      })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 8,
    borderRadius: 6,
    marginHorizontal: 2,
    // backgroundColor: '#E3E3E3',
  },
});
