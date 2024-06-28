import analytics from '@react-native-firebase/analytics';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import IconBackSub from '~/resources/Icons/IconBackSub';
import { useAppTheme } from '~/resources/theme';

import i18n from 'i18next';
import { RootNavigatorNavProps } from '~/navigation/RootNavigator';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SettingPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dataLanguage = i18n.language.slice(3);
  const theme = useAppTheme();
  const navigation = useNavigation<RootNavigatorNavProps>();

  const styleContainer = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDEDED',
        paddingTop: Platform.OS === 'ios' ? 0 : 30,
      },
    ],
    [theme],
  );
  const goSelectLanguage = () => {
    navigation.navigate('SelectLanguagePage');
  };
  React.useEffect(() => {
    const logEventAnalytics = async () => {
      await analytics().logEvent('SettingPage');
    };
    logEventAnalytics();
  }, []);
  return (
    <SafeAreaView style={styleContainer}>
      <View
        style={{
          flex: 1,
          width: '100%',
          paddingHorizontal: 24,
          paddingTop: 12,
        }}>
        <View>
          <Text
            style={{
              color: '#000000',
              fontSize: 24,
              textAlign: 'center',
              fontWeight: '900',
            }}>
            {t('Setting')}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
            paddingTop: 24,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text style={{ color: '#82828B', fontWeight: '900' }}>
                {t('Translation')}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: '#D9D9D9',
                width: SCREEN_WIDTH - 140,
              }}
            />
          </View>
          <TouchableOpacity onPress={() => navigation.replace('History')}>
            <View style={{ paddingHorizontal: 12, paddingVertical: 24 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Text style={{ color: '#000000', fontWeight: '900' }}>
                    {t('History')}
                  </Text>
                </View>
                <View>
                  <IconBackSub height={24} width={24} color={'#D9D9D9'} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              backgroundColor: '#D9D9D9',
              width: '100%',
            }}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Favorite')}>
            <View style={{ paddingHorizontal: 12, paddingVertical: 24 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Text style={{ color: '#000000', fontWeight: '900' }}>
                    {t('Favorite')}
                  </Text>
                </View>
                <View>
                  <IconBackSub height={24} width={24} color={'#D9D9D9'} />
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text style={{ color: '#82828B', fontWeight: '900' }}>
                {t('General')}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: '#D9D9D9',
                width: SCREEN_WIDTH - 120,
              }}
            />
          </View>
          <View style={{ paddingHorizontal: 12, paddingVertical: 24 }}>
            <TouchableOpacity onPress={goSelectLanguage}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Text style={{ color: '#000000', fontWeight: '900' }}>
                    {t('Language')}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ paddingRight: 10 }}>
                    <Text style={{ fontWeight: '900', color: '#A0A0A0' }}>
                      {t(dataLanguage)}
                    </Text>
                  </View>
                  <IconBackSub height={24} width={24} color={'#D9D9D9'} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#D9D9D9',
              width: '100%',
            }}
          />
          <View style={{ paddingHorizontal: 12, paddingVertical: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={{ color: '#000000', fontWeight: '900' }}>
                  {t('Term of Service')}
                </Text>
              </View>
              <View>
                <IconBackSub height={24} width={24} color={'#D9D9D9'} />
              </View>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#D9D9D9',
              width: '100%',
            }}
          />
          <View style={{ paddingHorizontal: 12, paddingVertical: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={{ color: '#000000', fontWeight: '900' }}>
                  {t('Privacy Policy')}
                </Text>
              </View>
              <View>
                <IconBackSub height={24} width={24} color={'#D9D9D9'} />
              </View>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#D9D9D9',
              width: '100%',
            }}
          />
          <View style={{ paddingHorizontal: 12, paddingVertical: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={{ color: '#000000', fontWeight: '900' }}>
                  {t('About Us')}
                </Text>
              </View>
              <View>
                <IconBackSub height={24} width={24} color={'#D9D9D9'} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingPage;

const styles = StyleSheet.create({});
