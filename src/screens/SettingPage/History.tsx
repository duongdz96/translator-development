import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import usePreferenceActionsContext from '~/hooks/usePreferenceActionsContext';
import usePreferenceContext from '~/hooks/usePreferenceContext';

import IconBack from '~/resources/Icons/IconBack';
import { useAppTheme } from '~/resources/theme';

import {
  HistoryRouteProps,
  RootNavigatorNavProps,
} from '~/navigation/RootNavigator';

import HistoryTrans from '../components/History/historyTrans';

const History = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRoute<HistoryRouteProps>();
  const dataRouter = router.params;
  const theme = useAppTheme();
  const actionButton = usePreferenceContext();
  const actionMethod = usePreferenceActionsContext();
  const dataHistory = actionButton.result.History;
  const dataFavorite = actionButton.result.Favorite;
  const [dataShow, setDataShow] = useState(dataHistory);
  const navigation = useNavigation<RootNavigatorNavProps>();
  const [dataFavorites, setDataFavorites] = useState(dataFavorite);
  const handleAddItem = async (id: any) => {
    const newItems = dataHistory.map((item) => {
      if (item.id === id) {
        return { ...item, active: true };
      }
      return item;
    });
    setDataShow(newItems);
    await AsyncStorage.setItem('dataHistory', JSON.stringify(newItems));
    actionMethod.setActionHistory?.(newItems);
  };

  const handleRemoveItem = async (id: any) => {
    const newArray = dataFavorite.filter((obj) => obj.id !== id);
    actionMethod.setActionFavorite?.(newArray);
    await AsyncStorage.setItem('dataFavorite', JSON.stringify(newArray));
    setDataFavorites(newArray);
  };
  React.useEffect(() => {
    const logEventAnalytics = async () => {
      await analytics().logEvent('History');
    };
    logEventAnalytics();
  }, []);
  const styleContainer = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDEDED',
        paddingTop: Platform.OS === 'ios' ? 0 : 50,
      },
    ],
    [theme],
  );
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
  const dataRouters = dataRouter ? 'HomeNavigator' : 'ProfileNavigator';
  return (
    <SafeAreaView style={styleContainer}>
      <View
        style={{
          flex: 1,
          width: '100%',
          paddingHorizontal: 24,
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
                screen: dataRouters,
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
            {t('History')}
          </Text>
          <View />
        </View>
        <>
          {dataHistory && dataHistory.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {dataShow
                .slice()
                .reverse()
                .map((item) => (
                  <HistoryTrans
                    title={item.title}
                    description={item.description}
                    inputLanguage={item.inputLanguage}
                    outputLanguage={item.outputLanguage}
                    active={item.active}
                    time={item.time}
                    id={item.id}
                    onAddItem={handleAddItem}
                    onRemove={handleRemoveItem}
                    dataRouter={dataRouter}
                  />
                ))}
            </ScrollView>
          ) : (
            <NotHaveHistory />
          )}
        </>
      </View>
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({});
