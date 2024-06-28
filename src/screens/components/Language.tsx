import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import { InterstitialAd, useRewardedAd } from 'react-native-google-mobile-ads';
import { Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import usePreferenceActionsContext from '~/hooks/usePreferenceActionsContext';
import usePreferenceContext from '~/hooks/usePreferenceContext';

import IconAds from '~/resources/Icons/IconAds';
import IconBack from '~/resources/Icons/IconBack';

import {
  LanguageRouteProps,
  RootNavigatorNavProps,
} from '~/navigation/RootNavigator';
import IconDropdown from '~/resources/Icons/IconDropdown';
import IconUp from '~/resources/Icons/IconUp';

const Language = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRoute<LanguageRouteProps>();
  const isOutPut = router.params.data || '';
  const actionMethod = usePreferenceActionsContext();
  const actionButton = usePreferenceContext();
  const isShowAds = actionButton.result.adsMobState.Reward;
  const dataLanguageAvailableDefault = actionButton.result.LanguageAvailable;
  const dataLanguageOtherNew = actionButton.result.LanguageOther;

  const [languageActive, setLanguageActive] = useState(dataLanguageOtherNew);
  const navigation = useNavigation<RootNavigatorNavProps>();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [dataItem, setDataItem] = useState('');
  const [dataLanguage, setDataLanguage] = useState(
    dataLanguageAvailableDefault,
  );
  const [dataActivated, setActivated] = useState(3);
  const ID_BANNER_ALL =
    (Platform?.OS === 'ios' ? Config?.IOS_REWARD : Config?.ANDROID_REWARD) ||
    '';

  const { isLoaded, isClosed, load, show } = useRewardedAd(ID_BANNER_ALL, {
    requestNonPersonalizedAdsOnly: true,
  });
  useEffect(() => {
    load();
  }, [load, isClosed]);
  const onChangeSearch = (query: string) => {
    setSearch(query);
  };
  useEffect(() => {
    const dataOtherLanguage = dataLanguageOtherNew.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
    setLanguageActive(dataOtherLanguage);
  }, [search]);
  useEffect(() => {
    const filteredData = dataLanguageAvailableDefault.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
    setDataLanguage(filteredData);
  }, [search]);
  const handleShowMore = () => {
    if (dataActivated === 3) {
      setActivated(dataLanguage.length);
    } else {
      setActivated(3);
    }
  };
  const handleSelectLanguage = async (item: any) => {
    setSearch('');
    setDataItem(item);
    setShowModal(true);
  };
  const handleAddLanguage = async () => {
    if (isLoaded && isShowAds) {
      show();
    }
    if (isOutPut === 'true') {
      actionMethod.setActionLanguageSelectOutPut?.(dataItem);
    }
    if (isOutPut === 'false') {
      actionMethod.setActionLanguageSelect?.(dataItem);
    }
    const foundObject = dataLanguage.find((e) => e.name === dataItem.name);
    const newLanguage = dataLanguageOtherNew.filter(
      (ob) => ob.name !== dataItem.name,
    );
    const dataLanguageAvailable = [...dataLanguageAvailableDefault, dataItem];
    if (!foundObject) {
      actionMethod.setActionLanguageAvailable?.(dataLanguageAvailable);
      actionMethod.setActionLanguageOther?.(newLanguage);
      await AsyncStorage.setItem(
        'dataLanguageAvailable',
        JSON.stringify(dataLanguageAvailable),
      );
      await AsyncStorage.setItem(
        'dataLanguageOther',
        JSON.stringify(newLanguage),
      );
    }
    navigation.goBack();
  };
  const handleSelectLanguageActive = (item: any) => {
    if (isOutPut === 'true') {
      actionMethod.setActionLanguageSelectOutPut?.(item);
    }
    if (isOutPut === 'false') {
      actionMethod.setActionLanguageSelect?.(item);
    }
    navigation.goBack();
  };
  React.useEffect(() => {
    const logEventAnalytics = async () => {
      await analytics().logEvent('Language');
    };
    logEventAnalytics();
  }, []);
  return (
    <>
      <View style={{ flex: 1 }}>
        <SafeAreaView>
          <View style={{ paddingHorizontal: 24 }}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 24,
              }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <IconBack width={24} height={24} />
              </TouchableOpacity>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 24,
                  textAlign: 'center',
                  fontWeight: '700',
                }}>
                {t('Language')}
              </Text>
              <View />
            </View>
            <View>
              <Searchbar
                placeholder='Search language'
                onChangeText={onChangeSearch}
                value={search}
                iconColor='#000000'
                placeholderTextColor='#A0A0A0'
                style={{
                  backgroundColor: showModal ? '#EDEDED' : '#ffffff',
                  borderRadius: 12,
                  borderColor: '#ffffff',
                }}
              />
            </View>
            <ScrollView
              style={{ marginBottom: 220, marginTop: 10 }}
              showsVerticalScrollIndicator={false}>
              <>
                <View style={{ paddingTop: 12 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: '#000000',
                    }}>
                    {t('Activated languages')}
                  </Text>
                  {dataLanguage.slice(0, dataActivated).map((item, index) => (
                    <TouchableOpacity
                      onPress={() => handleSelectLanguageActive(item)}>
                      <View style={{ paddingTop: 12 }} key={index}>
                        <View
                          style={{
                            borderRadius: 12,
                            backgroundColor: '#fff',
                            height: 64,
                            alignItems: 'center',
                            flexDirection: 'row',
                          }}>
                          <View style={{ paddingRight: 8, paddingLeft: 12 }}>
                            <Image
                              source={item.image}
                              style={{ width: 60, height: 40, borderRadius: 6 }}
                            />
                          </View>
                          <Text style={{ color: '#000000' }}>{item.name}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity onPress={handleShowMore}>
                  <View
                    style={{
                      paddingTop: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{
                      fontSize: 12,
                      textAlign: 'center',
                      paddingRight: 10,
                      color: '#A0A0A0',
                    }}>{dataActivated === 3 ? t('Show more') : t('Show less')}</Text>
                    {dataActivated === 3 ? <IconDropdown /> : <IconUp />}
                  </View>
                </TouchableOpacity>
                <View style={{ paddingTop: 12 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: '#000000',
                    }}>
                    {t('Other languages')}
                  </Text>
                  {languageActive.map((item) => (
                    <TouchableOpacity
                      onPress={() => handleSelectLanguage(item)}>
                      <View style={{ paddingTop: 12 }}>
                        <View
                          style={{
                            borderRadius: 12,
                            backgroundColor: '#fff',
                            height: 64,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View style={{ paddingRight: 8, paddingLeft: 12 }}>
                              <Image
                                source={item.image}
                                style={{
                                  width: 60,
                                  height: 40,
                                  borderRadius: 6,
                                }}
                              />
                            </View>
                            <Text style={{ color: '#000000' }}>
                              {item.name}
                            </Text>
                          </View>
                          <View style={{ paddingRight: 12 }}>
                            <IconAds />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            </ScrollView>
          </View>
        </SafeAreaView>
        {showModal && (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                position: 'absolute',
                width: '90%',
                borderRadius: 12,
                top: '40%',
                left: 20,
                backgroundColor: '#fff',
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#000000',
                  paddingVertical: 12,
                  textAlign: 'center',
                }}>
                {t('Notification')}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  paddingBottom: 12,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '400',
                    color: '#82828B',
                  }}>
                  {t('You need to watch a short ad video')}
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: '400', color: '#82828B' }}>
                  {t('to download this language')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderColor: '#82828B',
                  borderTopWidth: 1,
                }}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={{ width: '50%' }}>
                  <View
                    style={{
                      width: '100%',
                      borderColor: '#82828B',
                      borderRightWidth: 1,
                      paddingVertical: 12,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#000000',
                        fontWeight: '700',
                      }}>
                      {t('Cancel')}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAddLanguage}
                  style={{ width: '100%' }}>
                  <View
                    style={{
                      width: '50%',
                      paddingVertical: 12,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <IconAds />
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#000000',
                        fontWeight: '700',
                        paddingLeft: 8,
                      }}>
                      {t('Watch')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </>
  );
};
export default Language;
