import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';

import { useTopInset } from '~/hooks/useInset';
import usePreferenceContext from '~/hooks/usePreferenceContext';

import IconBack from '~/resources/Icons/IconBack';
import IconSuccess from '~/resources/Icons/IconSuccess';

import SelectLanguage from '~/screens/components/SelectLanguage';

import i18n from 'i18next';
import { RootNavigatorNavProps } from '~/navigation/RootNavigator';

import NativeAdsLanguage from '../components/AdsNativeLanguage';

const SelectLanguagePage = (): JSX.Element => {
  const { t } = useTranslation();
  const topInsets = useTopInset();
  const [Language, setLanguage] = useState('');
  const actionButton = usePreferenceContext();
  const isShowAds = actionButton.result.adsMobState.Native_Language;
  const ID_Language =
    (Platform?.OS === 'ios'
      ? Config?.IOS_NATIVE_LANGUAGE
      : Config?.ANDROID_NATIVE_LANGUAGE) || '';
  console.log(
    '🚀 ~ file: SelectLanguagePage.tsx:28 ~ SelectLanguagePage ~ Language:',
    Language,
  );
  const navigation = useNavigation<RootNavigatorNavProps>();

  const handleAccept = async () => {
    i18n.changeLanguage(Language);
    await AsyncStorage.setItem('languageApp', Language);
    navigation.goBack();
  };
  return (
    <View style={[styles.container, { paddingTop: topInsets }]}>
      <SafeAreaView style={styles.Area}>
        <View style={styles.content}>
          <View style={styles.head}>
            <View style={styles.headLeft}>
              <View style={styles.iconBack}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <IconBack width={28} height={28} />
                </TouchableOpacity>
              </View>
              <View style={styles.title}>
                <Text style={[styles.textHead]}>{t('Select Language')}</Text>
              </View>
              <TouchableOpacity onPress={handleAccept}>
                <IconSuccess width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>
          <SelectLanguage
            selectLanguage={(language) => setLanguage(language)}
          />
        </View>
      </SafeAreaView>
      {isShowAds && (
        <NativeAdsLanguage dataAds={ID_Language} mode={false} color={'#fff'} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: '#EDEDED',
  },
  Area: {
    flex: 1,
  },
  content: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBack: {
    paddingRight: 8,
  },
  textHead: {
    fontSize: 24,
    fontWeight: '700',
    alignItems: 'center',
    color: '#0057E7',
    fontFamily: 'Urbanist',
  },
  headLeft: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    width: '80%',
    textAlign: 'center',
    alignItems: 'center',
  },
});

export default SelectLanguagePage;
