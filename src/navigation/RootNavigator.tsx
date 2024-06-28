import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';

import LoginPage from '~/screens/Authentication/LoginPage';
import SignUpPage from '~/screens/Authentication/SignUpPage';
import LoadingFilePage from '~/screens/NotificationPage/LoadingFilePage';
import NotificationPage from '~/screens/NotificationPage/NotificationPage';
import SelectFile from '~/screens/NotificationPage/SelectFile';
import ViewFile from '~/screens/NotificationPage/ViewFile';
import OnBoardingPage from '~/screens/OnBoardingPage/OnBoardingPage';
import SelectLanguageOnboardingPage from '~/screens/OnBoardingPage/SelectLanguageOnboardingPage';
import DetailHistory from '~/screens/SettingPage/DetailHistory';
import Favorite from '~/screens/SettingPage/Favorite';
import History from '~/screens/SettingPage/History';
import SelectLanguagePage from '~/screens/SettingPage/SelectLanguagePage';
import SettingPage from '~/screens/SettingPage/SettingPage';
import SplashPage from '~/screens/SplashPage/SplashPage';
import TestPage from '~/screens/TestPage';
import WebViewPage from '~/screens/WebViewPage';
import Language from '~/screens/components/Language';

import BottomTabNavigator, {
  BottomTabNavigatorProps,
} from './BottomTabNavigator';

export type RootNavigatorProps = {
  navigate(arg0: string): unknown;
  SplashPage: undefined;
  TestPage: undefined;
  BottomTabNavigator: NavigatorScreenParams<BottomTabNavigatorProps>;
  OnBoardingPage: undefined;
  SettingPage: undefined;
  LoginPage: undefined;
  SignUpPage: undefined;
  SelectLanguagePage: undefined;
  NotificationPage: undefined;
  LoadingFilePage: undefined;
  SelectLanguageOnboardingPage: undefined;
  WebViewPage: { uri: string } | undefined;
  History: undefined;
  Favorite: undefined;
  Language: undefined;
  DetailHistory: undefined;
  ViewFile: undefined;
  SelectFile: undefined;
};

export type RootNavigatorNavProps = StackNavigationProp<RootNavigatorProps>;

export type BottomTabNavigatorNavProps = StackNavigationProp<
  RootNavigatorProps,
  'BottomTabNavigator'
>;

export type LanguageNavProps = StackNavigationProp<
  RootNavigatorProps,
  'Language'
>;
export type DetailHistoryRouteProps = RouteProp<
  RootNavigatorProps,
  'DetailHistory'
>;
export type DetailHistoryNavProps = StackNavigationProp<
  RootNavigatorProps,
  'DetailHistory'
>;
export type HistoryRouteProps = RouteProp<RootNavigatorProps, 'History'>;
export type HistoryNavProps = StackNavigationProp<
  RootNavigatorProps,
  'History'
>;

export type LanguageRouteProps = RouteProp<RootNavigatorProps, 'Language'>;

export type RootRouteProps<RouteName extends keyof RootNavigatorProps> =
  RouteProp<RootNavigatorProps, RouteName>;

const StackNavigator = createStackNavigator<RootNavigatorProps>();
const screenOptions = { headerShown: false };

const RootNavigator = (): JSX.Element => {
  return (
    <StackNavigator.Navigator
      screenOptions={screenOptions}
      initialRouteName='SplashPage'>
      <StackNavigator.Screen name='SplashPage' component={SplashPage} />
      <StackNavigator.Screen name='TestPage' component={TestPage} />
      <StackNavigator.Screen
        name='BottomTabNavigator'
        component={BottomTabNavigator}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='OnBoardingPage'
        component={OnBoardingPage}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='SelectLanguageOnboardingPage'
        component={SelectLanguageOnboardingPage}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='SettingPage'
        component={SettingPage}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='NotificationPage'
        component={NotificationPage}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='LoginPage'
        component={LoginPage}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='SignUpPage'
        component={SignUpPage}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='SelectLanguagePage'
        component={SelectLanguagePage}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='WebViewPage'
        component={WebViewPage}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='LoadingFilePage'
        component={LoadingFilePage}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='History'
        component={History}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='Favorite'
        component={Favorite}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='Language'
        component={Language}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='ViewFile'
        component={ViewFile}
        options={{ gestureEnabled: false }}
      />

      <StackNavigator.Screen
        name='SelectFile'
        component={SelectFile}
        options={{ gestureEnabled: false }}
      />
      <StackNavigator.Screen
        name='DetailHistory'
        component={DetailHistory}
        options={{ gestureEnabled: false }}
      />
    </StackNavigator.Navigator>
  );
};

export default RootNavigator;
