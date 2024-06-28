import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import usePreferenceActionsContext from '~/hooks/usePreferenceActionsContext';
import usePreferenceContext from '~/hooks/usePreferenceContext';

import IconBack from '~/resources/Icons/IconBack';
import { useAppTheme } from '~/resources/theme';

import { RootNavigatorNavProps } from '~/navigation/RootNavigator';

import HistoryTrans from '../components/History/historyTrans';

const Favorite = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const actionButton = usePreferenceContext();
  const dataFavorite = actionButton.result.Favorite;
  const dataHistory = actionButton.result.History;
  const actionMethod = usePreferenceActionsContext();
  const [dataFavorites, setDataFavorites] = useState(dataFavorite);
  const [showModal, setShowModal] = useState(false);
  const [dataId, setDataId] = useState('');
  const navigation = useNavigation<RootNavigatorNavProps>();

  const styleContainer = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 0 : 30,
      },
    ],
    [theme],
  );
  const handleRemoveItem = async (data: any) => {
    setShowModal(true);
    setDataId(data);
  };
  const handleRemoveFav = async () => {
    const newArray = dataFavorite.filter((obj) => obj.id !== dataId);
    actionMethod.setActionFavorite?.(newArray);
    await AsyncStorage.setItem('dataFavorite', JSON.stringify(newArray));
    setDataFavorites(newArray);
    setShowModal(false);
  };
  const handleRemove = () => {
    handleRemoveFav();
  };
  React.useEffect(() => {
    const logEventAnalytics = async () => {
      await analytics().logEvent('Favorite');
    };
    logEventAnalytics();
  }, []);
  const NotHaveHistory = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={require('~/resources/images/empty.png')} />
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
      <SafeAreaView style={styleContainer}>
        <View
          style={{
            flex: 1,
            width: '100%',
            paddingHorizontal: 24,
            paddingTop: 12,
          }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 24,
            }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('BottomTabNavigator', {
                  screen: 'ProfileNavigator',
                })
              }>
              <IconBack width={24} height={24} />
            </TouchableOpacity>
            <Text
              style={{
                color: '#000000',
                fontSize: 24,
                textAlign: 'center',
                fontWeight: '700',
              }}>
              {t('Favorite')}
            </Text>
            <View />
          </View>
          <>
            {dataFavorite && dataFavorite.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {dataFavorites
                  .slice()
                  .reverse()
                  .map((item) => (
                    <HistoryTrans
                      title={item.title}
                      description={item.description}
                      inputLanguage={item.inputLanguage}
                      outputLanguage={item.outputLanguage}
                      active={true}
                      time={item.time}
                      id={item.id}
                      onRemove={handleRemoveItem}
                    />
                  ))}
              </ScrollView>
            ) : (
              <NotHaveHistory />
            )}
          </>
        </View>
      </SafeAreaView>
      {showModal && (
        <View
          style={{
            flex: 1,
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
              backgroundColor: '#fff',
              left: 20,
              top: '40%',
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#000000',
                paddingVertical: 12,
                textAlign: 'center',
              }}>
              {t('Remove')}
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
                {t('Are you sure to remove this translation')}
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: '400', color: '#82828B' }}>
                {t('from favorite list?')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderColor: '#82828B',
                borderTopWidth: 1,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                }}
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
                onPress={() => handleRemove()}
                style={{ width: '100%' }}>
                <View
                  style={{
                    width: '50%',
                    paddingVertical: 12,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#000000',
                      fontWeight: '700',
                    }}>
                    {t('Remove')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Favorite;
