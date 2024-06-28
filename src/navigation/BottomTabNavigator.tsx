import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';

import { useBottomInset } from '~/hooks/useInset';
import usePreferenceContext from '~/hooks/usePreferenceContext';

import getImage from '~/libs/getImage';

import IconFileActive from '~/resources/Icons/IconBottomBar/IconFileActive';
import IconHome from '~/resources/Icons/IconBottomBar/IconHome';
import IconHomeUnAvailed from '~/resources/Icons/IconBottomBar/IconHomeUnAvaile';
import IconLocated from '~/resources/Icons/IconBottomBar/IconLocated';
import IconMusic from '~/resources/Icons/IconBottomBar/IconMusic';
import IconProfile from '~/resources/Icons/IconBottomBar/IconProfile';
import IconSettingActive from '~/resources/Icons/IconBottomBar/IconSettingActive';
import IconVoiceActive from '~/resources/Icons/IconBottomBar/IconVoiceActive';
import { useAppTheme } from '~/resources/theme';

import AdBanner from '~/screens/components/AdBanner';

import HomeNavigator, { HomeNavigatorProps } from './HomeNavigator';
import LibraryNavigator, { LibraryNavigatorProps } from './LibraryNavigator';
import NotificationNavigator, {
  NotificationNavigatorProps,
} from './NotificationNavigator';
import ProfileNavigator, { ProfileNavigatorProps } from './ProfileNavigator';
import { RootNavigatorProps } from './RootNavigator';

export type BottomTabNavigatorProps = {
  HomeNavigator: NavigatorScreenParams<HomeNavigatorProps> | undefined;
  LibraryNavigator: NavigatorScreenParams<LibraryNavigatorProps> | undefined;
  NotificationNavigator:
    | NavigatorScreenParams<NotificationNavigatorProps>
    | undefined;
  ProfileNavigator: NavigatorScreenParams<ProfileNavigatorProps> | undefined;
};

export type BottomTabNavigatorRouteProps = RouteProp<BottomTabNavigatorProps>;

export type BottomTabNavigatorNavProps = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabNavigatorProps>,
  StackNavigationProp<RootNavigatorProps>
>;

export type HomeNavigatorNavProps = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabNavigatorProps, 'HomeNavigator'>,
  StackNavigationProp<RootNavigatorProps>
>;

export type HomeNavigatorRouteProps = RouteProp<
  BottomTabNavigatorProps,
  'HomeNavigator'
>;

export type LibraryNavigatorNavProps = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabNavigatorProps, 'LibraryNavigator'>,
  StackNavigationProp<RootNavigatorProps>
>;

export type LibraryNavigatorRouteProps = RouteProp<
  BottomTabNavigatorProps,
  'LibraryNavigator'
>;

export type ProfileNavigatorNavProps = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabNavigatorProps, 'ProfileNavigator'>,
  StackNavigationProp<RootNavigatorProps>
>;

export type ProfileNavigatorRouteProps = RouteProp<
  BottomTabNavigatorProps,
  'ProfileNavigator'
>;

export type NotificationNavigatorNavProps = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabNavigatorProps, 'NotificationNavigator'>,
  StackNavigationProp<RootNavigatorProps>
>;

export type NotificationNavigatorRouteProps = RouteProp<
  BottomTabNavigatorProps,
  'NotificationNavigator'
>;

const BottomTabNavigator = (): JSX.Element => {
  const theme = useAppTheme();
  const Tab = createBottomTabNavigator();
  const { t } = useTranslation();
  const bottomInset = useBottomInset();
  const actionButton = usePreferenceContext();
  const isShowAds = actionButton.result.adsMobState.Banner;
  return (
    <>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: theme.colors.backgroundColor,
              borderTopColor: '#9E9E9E',
              borderTopWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 10,
              paddingBottom: Platform.OS === 'ios' ? 24 : 10,
              height: Platform.OS === 'android' ? 60 : bottomInset + 44,
            },
            tabBarActiveTintColor: theme.colors.titleActive,
            tabBarInactiveTintColor: theme.colors.title,
          }}>
          <Tab.Screen
            name='HomeNavigator'
            component={HomeNavigator}
            options={{
              tabBarLabel: t('Home'),
              tabBarIcon: ({ focused }) =>
                focused ? <IconHome /> : <IconHomeUnAvailed />,
            }}
          />

          <Tab.Screen
            name='LibraryNavigator'
            component={LibraryNavigator}
            options={{
              tabBarLabel: t('Voice'),
              tabBarIcon: ({ focused }) =>
                focused ? <IconVoiceActive /> : <IconLocated />,
            }}
          />

          <Tab.Screen
            name='NotificationNavigator'
            component={NotificationNavigator}
            options={{
              tabBarLabel: t('Files'),
              tabBarIcon: ({ focused }) =>
                focused ? <IconFileActive /> : <IconMusic />,
            }}
          />

          <Tab.Screen
            name='ProfileNavigator'
            component={ProfileNavigator}
            options={{
              tabBarLabel: t('Setting'),
              tabBarIcon: ({ focused }) =>
                focused ? <IconSettingActive /> : <IconProfile />,
            }}
          />
        </Tab.Navigator>
      </View>
      {isShowAds && <AdBanner />}
    </>
  );
};

export default BottomTabNavigator;
