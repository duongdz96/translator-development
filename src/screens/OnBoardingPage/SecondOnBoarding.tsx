import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import getImage from '~/libs/getImage';

import { dataOnboarding } from '~/dummyData/dataOnboarding';

const widthScreen = Dimensions.get('window').width;

const SecondOnBoarding = () => {
  const { t } = useTranslation();

  const slides = dataOnboarding;
  return (
    <View style={styles.wrapContent}>
      <View style={styles.box}>
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={styles.titleStyle}>{t(slides[1].title)}</Text>
          <Text style={styles.describeStyle}>{t(slides[1].describe)}</Text>
        </View>
        <View>
          <Image
            resizeMode='contain'
            source={getImage('onBoardingTwo')}
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
    marginLeft: 30,
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

export default SecondOnBoarding;
