import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Config from 'react-native-config';
import ExitApp from 'react-native-exit-app';

import usePreferenceContext from '~/hooks/usePreferenceContext';

import { useAppTheme } from '~/resources/theme';

import { dataOnboarding } from '~/dummyData/dataOnboarding';
import { RootNavigatorNavProps } from '~/navigation/RootNavigator';

import NativeAds from '../components/AdsNative';
import FirstOnBoarding from './FirstOnBoarding';
import LastOnBoarding from './LastOnBoarding';
import Pagination from './Pagination';
import SecondOnBoarding from './SecondOnBoarding';

const SCREEN_WIDTH = Dimensions.get('window').width;

const OnboardingPage = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation<RootNavigatorNavProps>();
  const theme = useAppTheme();
  const slides = dataOnboarding;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentSlideIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const actionButton = usePreferenceContext();
  const isShowAds = actionButton.result.adsMobState.Native_Onboarding;
  const ID_Native =
    (Platform.OS === 'android'
      ? Config?.ANDROID_NATIVE_TUTORIAL
      : Config?.IOS_NATIVE_TUTORIAL) || '';
  const goNextSlide = async () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < slides.length) {
      const offset = nextSlideIndex * SCREEN_WIDTH;
      ref?.current?.scrollToOffset({ offset, animated: true });
      Animated.timing(scrollX, {
        toValue: offset,
        duration: 100,
        useNativeDriver: false,
      }).start();
      setCurrentIndex(nextSlideIndex);
    } else {
      await AsyncStorage.setItem('FirstOnboarding', 'true');
      navigation.navigate('BottomTabNavigator', {
        screen: 'HomeNavigator',
      });
    }
  };
  const handleGoHome = async () => {
    navigation.navigate('BottomTabNavigator', {
      screen: 'HomeNavigator',
    });
    await AsyncStorage.setItem('FirstOnboarding', 'true');
  };
  useFocusEffect(
    React.useCallback(() => {
      let backButtonPressCount = 0;
      let backButtonPressTimer: ReturnType<typeof setTimeout> = null;

      const onBackPress = () => {
        if (backButtonPressCount === 1) {
          ExitApp.exitApp();
          return true;
        } else {
          backButtonPressCount++;
          backButtonPressTimer = setTimeout(() => {
            backButtonPressCount = 0;
            clearTimeout(backButtonPressTimer);
          }, 2000);
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        backHandler.remove();
      };
    }, []),
  );
  const handleOnScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
    },
  );

  const styleContainer = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDEDED',
      },
    ],
    [theme],
  );
  const SlideItem = [
    <FirstOnBoarding />,
    <SecondOnBoarding />,
    <LastOnBoarding />,
  ];
  const renderItem = ({ item }: any) => {
    return item;
  };
  const updateCurrentSlidesIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(currentIndex);
  };
  React.useEffect(() => {
    const logEventAnalytics = async () => {
      await analytics().logEvent('OnBoardingPage');
    };
    logEventAnalytics();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styleContainer}>
        <View
          style={{
            flex: 1,
            width: '100%',
          }}>
          {/* Header */}
          <View style={styles.wrapHeader}>
            <TouchableOpacity
              onPress={handleGoHome}
              style={styles.buttonHeader}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#A0A0A0',
                  fontWeight: '700',
                }}>
                {t('Skip')}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              flex: 1,
            }}>
            <FlatList
              ref={ref}
              onMomentumScrollEnd={updateCurrentSlidesIndex}
              data={SlideItem}
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              horizontal
              pagingEnabled
              keyExtractor={(item, index) => index.toString()}
              onScroll={handleOnScroll}
              style={{ zIndex: 10 }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 100,
                justifyContent: 'center',
                left: (SCREEN_WIDTH - 80) / 2,
              }}>
              <Pagination
                data={SlideItem}
                scrollX={scrollX}
                index={currentSlideIndex}
              />
            </View>
          </View>
          {/* Footer */}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: ID_Native ? 10 : 10,
              position: 'absolute',
              bottom: 0,
              left: 20,
              right: 20,
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <TouchableOpacity onPress={goNextSlide}>
                <View
                  style={{
                    backgroundColor: '#2665EF',
                    width: '100%',
                    height: 50,
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                    {t('NEXT')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {isShowAds && (
            <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
              <NativeAds dataAds={ID_Native} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingPage;

const styles = StyleSheet.create({
  wrapHeader: {
    alignItems: 'flex-end',
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    ...Platform.select({
      ios: {
        top: 20,
      },
      android: {
        top: 50,
      },
    }),

    right: 20,
    left: 20,
    zIndex: 11,
  },
  buttonHeader: {
    backgroundColor: '#D9D9D9',
    width: 63,
    height: 28,
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4D7D8',
    bottom: 1,
  },
});
