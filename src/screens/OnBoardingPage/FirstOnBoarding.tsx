import Lottie from 'lottie-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import getImage from '~/libs/getImage';

import { dataOnboarding } from '~/dummyData/dataOnboarding';

const widthScreen = Dimensions.get('window').width;

const FirstOnBoarding = () => {
  const { t } = useTranslation();

  const slides = dataOnboarding;
  return (
    <View style={styles.wrapContent}>
      <View style={styles.box}>
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={styles.titleStyle}>{t(slides[0].title)}</Text>
          <Text style={styles.describeStyle}>{t(slides[0].describe)}</Text>
        </View>
        <View>
          <Lottie
            source={getImage('onBoardingFirst')}
            resizeMode='cover'
            autoPlay
            loop
            style={styles.image}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapContent: {
    width: widthScreen,
    flex: 1,
    paddingTop: 90,
  },
  image: {
    width: widthScreen - 60,
    marginTop: 20,
    marginLeft: 10,
  },
  box: {
    justifyContent: 'flex-end',
    width: '100%',
  },

  describeStyle: {
    fontFamily: 'Urbanist',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
    color: '#000000',
  },

  titleStyle: {
    fontFamily: 'Urbanist',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    paddingBottom: 18,
    color: '#000000',
  },
});

export default FirstOnBoarding;
