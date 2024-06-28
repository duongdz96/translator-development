import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import useModalManager from '~/hooks/useModalManager';

import getImage from '~/libs/getImage';
 
const VoiceRecordAnimated = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const {openModal} = useModalManager();
  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };
  return (
    <TouchableOpacity onPress={toggleAnimation}>
      <LottieView
        style={styles.lottieView}
        source={require('~/resources/animation/record_animation.json')}
        autoPlay={isAnimating}
        loop={isAnimating}
        resizeMode='cover'
        speed={2.5}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  lottieView: {
    width: 144,
    height: 144,
  },
});

export default VoiceRecordAnimated;
