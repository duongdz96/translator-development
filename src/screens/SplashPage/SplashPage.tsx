import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import remoteConfig from '@react-native-firebase/remote-config';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SkypeIndicator } from 'react-native-indicators';

import usePreferenceActionsContext from '~/hooks/usePreferenceActionsContext';

import getImage from '~/libs/getImage';

import { useAppTheme } from '~/resources/theme';

import i18n from 'i18next';
import { dataCountry } from '~/dummyData/dataCountry';
import { RootNavigatorNavProps } from '~/navigation/RootNavigator';

const SplashPage = (): JSX.Element => {
  const navigation = useNavigation<RootNavigatorNavProps>();
  const theme = useAppTheme();
  const actionMethod = usePreferenceActionsContext();
  const { t } = useTranslation();

  const [isFirst, setIsFirst] = useState(false);

  useEffect(() => {
    const loadPurchase = async () => {
      const isFirstState = await AsyncStorage.getItem('isFirstOpen');
      if (isFirstState === null) {
        setIsFirst(true);
        await AsyncStorage.setItem('isFirstOpen', 'true');
      }
    };
    loadPurchase();
  }, []);

  const styleContainer = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        backgroundColor: '#EDEDED',
      },
      styles.viewContainer,
    ],
    [theme],
  );

  const styleAppName = useMemo<StyleProp<TextStyle>>(
    () => [
      {
        color: theme.colors.black,
        marginTop: 24,
        fontWeight: '700',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 32,
        textAlign: 'center',
      },
    ],
    [theme],
  );

  useEffect(() => {
    const loadLanguage = async () => {
      const language = await AsyncStorage.getItem('languageApp');
      if (language) {
        i18n.changeLanguage(language);
      }
    };
    loadLanguage();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const saveFirstVisit = async () => {
        await AsyncStorage.setItem('isFirstVisit', 'true');
      };
      saveFirstVisit();
    }, []),
  );

  useEffect(() => {
    const dataNavigate = async () => {
      const data = await AsyncStorage.getItem('FirstLanguage');
      const dataOnboarding = await AsyncStorage.getItem('FirstOnboarding');
      const timeoutId = setTimeout(() => {
        if (data === 'true') {
          if (dataOnboarding === 'true') {
            navigation.navigate('BottomTabNavigator', {
              screen: 'HomeNavigator',
            });
          } else {
            navigation.navigate('OnBoardingPage');
          }
        } else {
          navigation.navigate('SelectLanguageOnboardingPage');
        }
      }, 3000);

      return () => clearTimeout(timeoutId);
    };
    dataNavigate();
  }, []);
  useEffect(() => {
    const fetchAdsMob = async () => {
      await remoteConfig().setDefaults({
        Banner: 'disabled',
        Inter_ads: 'disabled',
        Native_Onboarding: 'disabled',
        Reward: 'disabled',
        Native_detail_history: 'disabled',
        Native_file_page: 'disabled',
        Native_history: 'disabled',
        Native_Language: 'disabled',
      });
      await remoteConfig().setConfigSettings({
        minimumFetchIntervalMillis: 1000,
      });
      try {
        await remoteConfig().fetchAndActivate();
        const configKeys = [
          'Banner',
          'Inter_ads',
          'Native_Onboarding',
          'Reward',
          'Native_detail_history',
          'Native_file_page',
          'Native_history',
          'Native_Language',
        ];
        const remoteConfigData = {} as any;
        configKeys.forEach((key) => {
          remoteConfigData[key] = remoteConfig().getBoolean(key);
        });
        actionMethod.setStateAdsMob?.(remoteConfigData);
      } catch (error) {
        console.error('Error fetching remote config:', error);
      }
    };
    fetchAdsMob();
  }, []);
  useEffect(() => {
    const data = async () => {
      const dataLanguageAvailable = await AsyncStorage.getItem(
        'dataLanguageAvailable',
      );
      if (dataLanguageAvailable !== null) {
        const dataLanguage = JSON.parse(dataLanguageAvailable);
        actionMethod.setActionLanguageAvailable?.(dataLanguage);
      }
      const dataLanguageOther = await AsyncStorage.getItem('dataLanguageOther');
      if (dataLanguageOther !== null) {
        const dataLanguageNew = JSON.parse(dataLanguageOther);
        actionMethod.setActionLanguageOther?.(dataLanguageNew);
      } else {
        actionMethod.setActionLanguageOther?.(dataCountry);
      }
      const dataHistory = await AsyncStorage.getItem('dataHistory');
      if (dataHistory !== null) {
        const dataHistoryNew = JSON.parse(dataHistory);
        actionMethod.setActionHistory?.(dataHistoryNew);
      } else {
        const data: { title: string; description: string; time: string }[] = [];
        actionMethod.setActionHistory?.(data);
      }
      const dataFavorite = await AsyncStorage.getItem('dataFavorite');
      if (dataFavorite !== null) {
        const dataFavoriteNew = JSON.parse(dataFavorite);
        actionMethod.setActionFavorite?.(dataFavoriteNew);
      } else {
        const data: { title: string; description: string; time: string }[] = [];
        actionMethod.setActionFavorite?.(data);
      }
    };
    data();
  });
  React.useEffect(() => {
    const logEventAnalytics = async () => {
      await analytics().logEvent('SplashPage');
    };
    logEventAnalytics();
  }, []);
  return (
    <View style={styleContainer}>
      <View style={styles.viewLogo}>
        <Image
          source={getImage('logoTrans')}
          style={{ width: 120, height: 120 }}
        />
        <Text style={styleAppName}>{t(`Welcome!`)}</Text>
      </View>
      <View style={styles.loading}>
        <SkypeIndicator color={'#0057E7'} size={50} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewLogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: { position: 'absolute', bottom: 100 },
});

export default SplashPage;
