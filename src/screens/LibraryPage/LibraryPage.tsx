import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import AnimatedLottieView from 'lottie-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import Textarea from 'react-native-textarea';

import useModalManager from '~/hooks/useModalManager';
import usePreferenceContext from '~/hooks/usePreferenceContext';
import useTokenGCP from '~/hooks/useTokenGCP';

import IconDropdown from '~/resources/Icons/IconDropdown';
import { useAppTheme } from '~/resources/theme';

import axios from 'axios';
import dayjs from 'dayjs';
import { RootNavigatorNavProps } from '~/navigation/RootNavigator';

const LibraryPage = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<RootNavigatorNavProps>();
  const { openModal } = useModalManager();
  const actionButton = usePreferenceContext();
  const dataLanguageInput = actionButton.result.languageSelect;
  const dataLanguageOutPut = actionButton.result.languageSelectOutput;
  const dataHistory = actionButton.result.History;
  const [outputVoice, setOutputVoice] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const token = useTokenGCP();

  const lottieRef = useRef<AnimatedLottieView | null>(null);
  useEffect(() => {
    if (lottieRef.current) {
      if (isAnimating) {
        lottieRef.current?.play();
      } else {
        lottieRef.current?.reset();
      }
    }
  }, [isAnimating]);

  // fix bug 19/3
  useEffect(() => {
    const blurListener = navigation.addListener('blur', () => {
      if (lottieRef.current) {
        lottieRef.current.reset();
        setIsAnimating(false);
        setIsListening(false);
        Voice.stop();
      }
    });
  
    const focusListener = navigation.addListener('focus', () => {
      if (lottieRef.current) {
        lottieRef.current.reset();
        setIsAnimating(false);
        setIsListening(false);
        Voice.stop();
      }
    });
  
    return () => {
      blurListener();
      focusListener();
    };
  }, [navigation]);

  const record = async () => {
    let permission;
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.MICROPHONE;
    } else if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.RECORD_AUDIO;
    }
    const microphonePermissionsStatus = await check(permission);
    if (microphonePermissionsStatus == RESULTS.GRANTED) {
      if (dataLanguageInput.countyCode === dataLanguageOutPut.countyCode) {
        openModal('LanguageModal');
        return;
      }
      startRecord();
    } else {
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        if (dataLanguageInput.countyCode === dataLanguageOutPut.countyCode) {
          openModal('LanguageModal');
          return;
        }
        startRecord();
      } else {
        openModal('VoicePermissionModal');
      }
    }
  };
  const startRecord = async () => {
    setIsAnimating(true);
    setIsListening(true);
    await Voice.start(dataLanguageInput.countyCode);
  };
  useEffect(()=> {
    if ( recognizedText && recognizedText.trim()  !== '' ) {
      console.log('inout voice change');
     stopRecord();
    }
  },[recognizedText])

  const stopRecord = async () => {
    try {
      const dataTimeSave = dayjs();
      const dateSaveTime = dayjs(dataTimeSave).format('DD/MM/YYYY');
      const idHistory = dayjs();
      const timeData = idHistory.unix();
      const ID = String(timeData);
      await Voice.stop();
      setIsListening(false);
      setIsAnimating(false);
      const translatedText = await translateText(
        recognizedText,
        dataLanguageInput.countyCode,
        dataLanguageOutPut.countyCode,
      );
      setOutputVoice(translatedText);
      if (translatedText) {
        const dataHistoryNew = {
          title: recognizedText,
          description: translatedText,
          time: dateSaveTime,
          id: ID,
          inputLanguage: dataLanguageInput,
          outputLanguage: dataLanguageOutPut,
          active: false,
        };
        const newHistory = dataHistory.push(dataHistoryNew);
        console.log(newHistory, 'newHistory');
        await AsyncStorage.setItem('dataHistory', JSON.stringify(dataHistory));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e) => {
    const spokenText = e.value[0];
    setRecognizedText(spokenText);
    console.log(spokenText, "2222");
  }
  const styleContainer = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#EDEDED',
      },
    ],
    [theme],
  );
  const translateText = async (
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
  ) => {
    try {
      const response = await axios.post(
        'https://translation.googleapis.com/language/translate/v2',
        {
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-goog-user-project': 'translation-app-410307',
          },
        },
      );
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      openModal('ErrorTranslation');
    }
  };
  return (
    <SafeAreaView style={styleContainer}>
      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: Platform.select({
            ios: 0,
            android: 70,
          }),
          paddingBottom: Platform.select({
            ios: 0,
            android: 70,
          }),
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            width: '40%',
            borderRadius: 12,
            height: 48,
            justifyContent: 'center',
            marginVertical: 16,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Language', { data: 'false' })}
            style={{ width: '100%' }}>
            <View
              style={{
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ paddingRight: 8 }}>
                  <Image
                    source={dataLanguageInput.image}
                    style={{ width: 24, height: 16 }}
                  />
                </View>
                <Text style={{ color: '#000000' }}>
                  {dataLanguageInput.name}
                </Text>
              </View>
              <View>
                <IconDropdown />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 16,
            borderRadius: 12,
            paddingVertical: 12,
            width: '100%',
            height: 200,
          }}>
          <Textarea
            containerStyle={styles.textareaContainer}
            onChangeText={(e: any) => setRecognizedText(e)}
            placeholder={t('Speak now')}
            placeholderTextColor={'#c7c7c7'}
            underlineColorAndroid={'transparent'}
            editable={false}
            value={recognizedText}
            style={{ color: '#000000' }}
          />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            width: '40%',
            borderRadius: 12,
            height: 48,
            justifyContent: 'center',
            marginVertical: 16,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Language', { data: 'true' })}
            style={{ width: '100%' }}>
            <View
              style={{
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ paddingRight: 8 }}>
                  <Image
                    source={dataLanguageOutPut.image}
                    style={{ width: 24, height: 16 }}
                  />
                </View>
                <Text style={{ color: '#000000' }}>
                  {dataLanguageOutPut.name}
                </Text>
              </View>
              <View>
                <IconDropdown />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 16,
            borderRadius: 12,
            paddingVertical: 12,
            width: '100%',
            height: 200,
          }}>
          <Textarea
            containerStyle={styles.textareaContainer}
            onChangeText={(e: any) => setOutputVoice(e)}
            underlineColorAndroid={'transparent'}
            editable={false}
            value={outputVoice}
            style={{ color: '#000000' }}
          />
        </View>
        <TouchableOpacity onPress={isListening ? stopRecord : record}>
          <LottieView
            ref={lottieRef}
            style={styles.lottieView}
            source={require('~/resources/animation/record_animation.json')}
            loop={true}
            resizeMode='cover'
            speed={2.5}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LibraryPage;

const styles = StyleSheet.create({
  textareaContainer: {
    height: 120,
    padding: 5,
  },
  lottieView: {
    width: 144,
    height: 144,
  },
});
