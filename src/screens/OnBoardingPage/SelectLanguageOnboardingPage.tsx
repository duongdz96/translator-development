import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';

import IconConfirm from '~/resources/Icons/IconConfirm';

import i18n from 'i18next';
import RadioButton from '~/base/RadioButton';
import { RootNavigatorNavProps } from '~/navigation/RootNavigator';

import NativeAds from '../components/AdsNative';

const SelectLanguageOnboardingPage = (): JSX.Element => {
  const { t } = useTranslation();
  const languageCountry = [
    {
      title: 'English',
      language: 'en_English',
      icon: (
        <Image
          source={require('../../resources/images/Language/eng_flag.png')}
          style={{ width: 28, height: 28 }}
        />
      ),
    },
    {
      title: 'Hindi',
      language: 'hi_Hindi',
      icon: (
        <Image
          source={require('../../resources/images/Language/Hindi.png')}
          style={{ width: 28, height: 28 }}
        />
      ),
    },
    {
      title: 'Portuguese',
      language: 'pt_Portuguese',
      icon: (
        <Image
          source={require('../../resources/images/Language/Por.png')}
          style={{ width: 28, height: 28 }}
        />
      ),
    },
    {
      title: 'Spanish',
      language: 'es_Spanish',
      icon: (
        <Image
          source={require('../../resources/images/Language/Spanish.png')}
          style={{ width: 28, height: 28 }}
        />
      ),
    },
    {
      title: 'Indonesian',
      language: 'id_Indonesian',
      icon: (
        <Image
          source={require('../../resources/images/Language/Indonesian.png')}
          style={{ width: 28, height: 28 }}
        />
      ),
    },
    {
      title: 'Korean',
      language: 'ko_Korean',
      icon: (
        <Image
          source={require('../../resources/images/Language/Korean.png')}
          style={{ width: 28, height: 28 }}
        />
      ),
    },
  ];

  const [Language, setLanguage] = useState('en_English');
  const ID_Native =
    (Platform.OS === 'android'
      ? Config?.ANDROID_NATIVE_TUTORIAL
      : Config?.IOS_NATIVE_TUTORIAL) || '';

  const navigation = useNavigation<RootNavigatorNavProps>();

  useFocusEffect(
    useCallback(() => {
      let backButtonPressCount = 0;
      let backButtonPressTimer = null;

      const onBackPress = () => {
        if (backButtonPressCount === 1) {
          // User has pressed the back button twice, so close the app
          BackHandler.exitApp();
          return true;
        } else {
          // First back button press, set a timer to reset the count
          backButtonPressCount++;
          backButtonPressTimer = setTimeout(() => {
            backButtonPressCount = 0;
            clearTimeout(backButtonPressTimer);
          }, 2000); // Adjust the timeout as needed (e.g., 2 seconds)
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  const handleAccept = async () => {
    navigation.navigate('OnBoardingPage');
    i18n.changeLanguage(Language);
    await AsyncStorage.setItem('languageApp', Language);
    await AsyncStorage.setItem('FirstLanguage', 'true');
  };

  const handSelect = (item: any) => {
    console.log(item, 'item');
    setLanguage(item.language);
  };

  return (
    <View style={[styles.container]}>
      <SafeAreaView style={styles.Area}>
        <View style={styles.head}>
          <View style={styles.title}>
            <Text style={[styles.textHead]}>{t('Language')}</Text>
          </View>
          {Language && (
            <TouchableOpacity onPress={handleAccept}>
              <View>
                <IconConfirm height={30} width={30} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.listItem}>
            {languageCountry.map((item) => (
              <TouchableOpacity
                key={item.language}
                style={
                  Language === item?.language ? styles.active : styles.item
                }
                onPress={() => handSelect(item)}>
                <View style={styles.contentItem}>
                  <View style={styles.leftItem}>
                    <View>{item.icon}</View>
                    <Text
                      style={[
                        styles.textItem,
                        {
                          color:
                            Language === item?.language ? '#0057E7' : '#262626',
                        },
                      ]}>
                      {item.title}
                    </Text>
                  </View>
                  <RadioButton
                    state={Language === item?.language ? true : false}
                    color={Language === item?.language ? '#0057E7' : '#ffffff'}
                    onPress={() => handSelect(item)}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* {Language && (
          <TouchableOpacity onPress={handleAccept}>
            <View
              style={{
                backgroundColor: '#2665EF',
                width: '100%',
                height: 50,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.select({
                  android: 20,
                  ios: 10,
                }),
              }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                {t('GET STARTED')}
              </Text>
            </View>
          </TouchableOpacity>
        )} */}
        <View style={{ paddingBottom: 12 }}>
          <NativeAds dataAds={ID_Native} />
        </View>
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#EDEDED',
  },
  Area: {
    flex: 1,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  textHead: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'SFProDisplay-Medium',
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    paddingVertical: 24,
  },
  item: {
    borderRadius: 7,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#50505024',
  },
  active: {
    borderRadius: 7,
    borderWidth: 2,
    marginBottom: 8,
    borderColor: '#0057E7',
  },
  contentItem: {
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    justifyContent: 'space-between',
  },
  textItem: {
    fontSize: 16,
    fontWeight: '600',
    paddingLeft: 8,
  },
  leftItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SelectLanguageOnboardingPage;
