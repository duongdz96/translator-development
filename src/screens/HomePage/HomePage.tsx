import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import analytics from '@react-native-firebase/analytics';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  Clipboard,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import ExitApp from 'react-native-exit-app';
import RNFS from 'react-native-fs';
import { ScrollView } from 'react-native-gesture-handler';
import Share from 'react-native-share';
import Sound from 'react-native-sound';
import Textarea from 'react-native-textarea';

import useModalManager from '~/hooks/useModalManager';
import usePreferenceActionsContext from '~/hooks/usePreferenceActionsContext';
import usePreferenceContext from '~/hooks/usePreferenceContext';
import useTokenGCP from '~/hooks/useTokenGCP';

import IconCopy from '~/resources/Icons/IconCopy';
import IconDropdown from '~/resources/Icons/IconDropdown';
import IconHistory from '~/resources/Icons/IconHistory';
import IconShare from '~/resources/Icons/IconShare';
import IconStar from '~/resources/Icons/IconStar';
import IconSwap from '~/resources/Icons/IconSwap';
import IconVoice from '~/resources/Icons/IconVoice';
import { useAppTheme } from '~/resources/theme';

import axios from 'axios';
import dayjs from 'dayjs';
import { RootNavigatorNavProps } from '~/navigation/RootNavigator';

const HomePage = (): JSX.Element => {
  const actionButton = usePreferenceContext();
  const actionMethod = usePreferenceActionsContext();
  const [dataLanguageInput, setDataLanguageInput] = useState(
    actionButton.result.languageSelect,
  );
  const [dataLanguageOutPut, setDataLanguageOutPut] = useState(
    actionButton.result.languageSelectOutput,
  );
  const dataHistory = actionButton.result.History;
  const dataFavorite = actionButton.result.Favorite;
  const [activeStar, setActiveStar] = useState(Boolean);
  const { t } = useTranslation();
  const theme = useAppTheme();
  const [textInput, setTextInput] = useState('');
  const [textOutPut, setTextOutPut] = useState('');
  const navigation = useNavigation<RootNavigatorNavProps>();
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const isShowAds = actionButton.result.adsMobState.Banner;
  const token = useTokenGCP();
  const { openModal } = useModalManager();
  const [isTranslated, setIsTranslated] = useState(false);

  const handleAddFav = async () => {
    const dataTimeSave = dayjs();
    const dateSaveTime = dayjs(dataTimeSave).format('DD/MM/YYYY');
    const idHistory = dayjs();
    const timeData = idHistory.unix();
    const ID = String(timeData);
    if (textInput && textOutPut) {
      const dataFavoriteNew = {
        title: textInput,
        description: textOutPut,
        time: dateSaveTime,
        id: ID,
        active: true,
        inputLanguage: dataLanguageInput,
        outputLanguage: dataLanguageOutPut,
      };
      const isAdd = dataFavorite.find((obj) => obj.id === ID);
      if (activeStar === false) {
        if (!isAdd) {
          const newFavorite = dataFavorite.push(dataFavoriteNew);
          await AsyncStorage.setItem(
            'dataFavorite',
            JSON.stringify(dataFavorite),
          );
          dataHistory.pop();
          dataHistory.push(dataFavoriteNew);
          setActiveStar(true);
        }
      } else {
        setActiveStar(false);
        const updateFavorites = dataFavorite.filter((obj) => obj.id !== ID);
        await AsyncStorage.setItem(
          'dataFavorite',
          JSON.stringify(updateFavorites),
        );
        const favorites = dataFavorite.pop();
        dataHistory[dataHistory.length - 1].active = false;
      }
      setActiveStar(!activeStar);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let backButtonPressCount = 0;
      let backButtonPressTimer: ReturnType<typeof setTimeout> = null;

      const onBackPress = () => {
        if (backButtonPressCount === 1) {
          ExitApp.exitApp();
          return true;
        } else {
          backButtonPressCount++;
          backButtonPressTimer = setTimeout(() => {
            backButtonPressCount = 0;
            clearTimeout(backButtonPressTimer);
          }, 2000);
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        backHandler.remove();
      };
    }, []),
  );

  const handleCopyInput = () => {
    Clipboard.setString(textInput);
    ToastAndroid.show('Text copied to clipboard!', ToastAndroid.SHORT);
  };
  const onChangeInput = (e: any) => {
    setTextInput(e);
  };
  const onChangeOutPut = (e: any) => {
    setTextOutPut(e);
  };
  const handleCopy = () => {
    Clipboard.setString(textOutPut);
    ToastAndroid.show('Text copied to clipboard!', ToastAndroid.SHORT);
  };

  const handleTrans = async () => {
    const dataTimeSave = dayjs();
    const dateSaveTime = dayjs(dataTimeSave).format('DD/MM/YYYY');
    const idHistory = dayjs();
    const timeData = idHistory.unix();
    const ID = String(timeData);
    if (textInput) {
      setIsTranslated(false);
      if (dataLanguageInput.countyCode === dataLanguageOutPut.countyCode) {
        openModal('LanguageModal');
        return;
      }
      setActiveStar(false);
      const translatedText = await translateText(
        textInput,
        dataLanguageInput.countyCode,
        dataLanguageOutPut.countyCode,
      );
      setTextOutPut(translatedText);
      if (translatedText) {
        const dataHistoryNew = {
          title: textInput,
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

    } else {
      console.log('typing to translate');
    }
  };

  useEffect(() => {
    if (textInput && textInput.trim() === '') {
      setIsTranslated(false);
    } else if (textInput && dataLanguageOutPut) {
      setIsTranslated(true);
    }
  }, [textInput, dataLanguageOutPut]);

  const styleContainer = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        flex: 1,
        justifyContent: 'center',
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
            'x-goog-user-project': 'gen-lang-client-0531642691',
          },
        },
      );
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      openModal('ErrorTranslation');
    }
  };
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const dataConnect = state.isConnected ? state.isConnected : true;
      setIsConnected(dataConnect);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSpeakTextInput = async () => {
    if (isPlaying) {
      stopSound();
    } else {
      fetchAndPlayTTS(textInput, dataLanguageInput.countyCode);
    }
  };

  const handleSpeakTextOutput = async () => {
    if (isPlaying) {
      stopSound();
    } else {
      fetchAndPlayTTS(textOutPut, dataLanguageOutPut.countyCode);
    }
  };
  function swapLangue() {
    const temp = dataLanguageInput;
    setDataLanguageInput(dataLanguageOutPut);
    setDataLanguageOutPut(temp);
    const swapTextInput = textInput;
    const swapTextOutput = textOutPut;
    setTextInput(swapTextOutput);
    setTextOutPut(swapTextInput);
  }

  useEffect(() => {
    setDataLanguageInput(actionButton.result.languageSelect);
  }, [actionButton.result.languageSelect]);
  useEffect(() => {
    setDataLanguageOutPut(actionButton.result.languageSelectOutput);
  }, [actionButton.result.languageSelectOutput]);

  const handleShare = () => {
    const shareOptions = {
      message: textOutPut,
    };

    Share.open(shareOptions)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const createFile = async (path, data) => {
    try {
      return await RNFS.writeFile(path, data, 'base64');
    } catch (err) {
      console.warn(err);
    }

    return null;
  };

  let queue = [];
  let isPlaying = false;
  let currentSound = null;

  const playSound = async (path) => {
    return new Promise((resolve, reject) => {
      const sound = new Sound(path, '', (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          reject(error);
        } else {
          if (currentSound) {
            currentSound.stop();
            currentSound.release();
          }
          currentSound = sound;
          sound.play((success) => {
            if (success) {
              resolve(true);
            } else {
              console.log('Playback failed due to audio decoding errors');
              reject(new Error('Playback failed'));
            }
          });
        }
      });
    });
  };

  const processQueue = async () => {
    if (queue.length > 0 && !isPlaying) {
      isPlaying = true;
      const item = queue.shift();
      try {
        await playSound(item);
      } catch (error) {
        console.log('Error playing sound', error);
      }
      isPlaying = false;
      processQueue();
    }
  };

  const fetchAndPlayTTS = async (text, languageCode) => {
    try {
      const response = await axios.post(
        'https://texttospeech.googleapis.com/v1/text:synthesize',
        {
          input: { text: text },
          voice: { languageCode: languageCode, ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-goog-user-project': 'translation-app-410307',
          },
        },
      );

      const audioContent = response.data.audioContent;
      const path = `${RNFS.DocumentDirectoryPath}/voice.mp3`;
      createFile(path, audioContent);
      queue.push(path);
      processQueue();
    } catch (error) {
      console.log('Error fetching TTS audio', error);
    }
  };

  const stopSound = () => {
    if (currentSound) {
      currentSound.stop();
      currentSound.release();
      currentSound = null;
    }
    isPlaying = false;
  };

  React.useEffect(() => {
    const logEventAnalytics = async () => {
      await analytics().logEvent('Home');
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
          paddingTop: Platform.select({
            ios: 0,
            android: 60,
          }),
        }}>
        {!isConnected && (
          <Text style={{ textAlign: 'center', color: 'red' }}>
            {t('No internet working, please check your connection!')}
          </Text>
        )}
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 24,
          }}>
          <View />
          <Text
            style={{
              color: '#000000',
              fontSize: 24,
              textAlign: 'center',
              fontWeight: '700',
            }}>
            {t('Translator')}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('History', true)}>
            <IconHistory />
          </TouchableOpacity>
        </View>
        <>
          <View
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 5 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  width: '40%',
                  borderRadius: 12,
                  height: 48,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Language', { data: 'false' })
                  }
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
                      <Text style={{ color: '#000000' }} numberOfLines={1}>
                        {dataLanguageInput.name}
                      </Text>
                    </View>
                    <View>
                      <IconDropdown />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => swapLangue()}
                style={{
                  backgroundColor: '#2665EF',
                  width: 48,
                  height: 48,
                  borderRadius: 99,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <IconSwap />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#fff',
                  width: '40%',
                  borderRadius: 12,
                  height: 48,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Language', { data: 'true' })
                  }
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
                      <Text style={{ color: '#000000' }} numberOfLines={1}>
                        {dataLanguageOutPut.name}
                      </Text>
                    </View>
                    <View>
                      <IconDropdown />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View style={{ paddingTop: 24 }}>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    paddingVertical: 12,
                    height: isShowAds
                      ? SCREEN_HEIGHT * 0.3 - 20
                      : SCREEN_HEIGHT * 0.3,
                    justifyContent: 'space-between',
                  }}>
                  <Textarea
                    containerStyle={styles.textareaContainer}
                    onChangeText={(e: any) => onChangeInput(e)}
                    underlineColorAndroid={'transparent'}
                    value={textInput}
                    style={{
                      color: '#000000',
                      fontWeight: '400',
                      fontSize: 14,
                      lineHeight: 20,
                      flex: 1,
                      textAlignVertical: 'top',
                      paddingBottom: 0,
                      paddingTop: 0,
                    }}
                  />
                  <View>
                    <View
                      style={{
                        backgroundColor: '#A0A0A0',
                        width: '100%',
                        height: 1,
                      }}
                    />
                    <View
                      style={{
                        paddingTop: 14,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      <TouchableOpacity onPress={handleSpeakTextInput}>
                        <IconVoice />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleCopyInput}>
                        <View style={{ paddingLeft: 24 }}>
                          <IconCopy />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={handleTrans} disabled={!textInput || !isTranslated}>
                <View
                  style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <View
                    style={{
                      backgroundColor: isTranslated ? '#2665EF' : '#A0A0A0',
                      width: 154,
                      height: 48,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: 12,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: '900',
                      }}>
                      {t('Translate')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    paddingVertical: 12,
                    height: isShowAds
                      ? SCREEN_HEIGHT * 0.3 - 20
                      : SCREEN_HEIGHT * 0.3,
                    justifyContent: 'space-between',
                  }}>
                  <View style={styles.textareaContainer}>
                    <ScrollView
                      style={{ flex: 1 }}
                      showsVerticalScrollIndicator={false}>
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: '400',
                          fontSize: 14,
                          lineHeight: 20,
                        }}>
                        {textOutPut}
                      </Text>
                    </ScrollView>
                  </View>

                  <View>
                    <View
                      style={{
                        backgroundColor: '#A0A0A0',
                        width: '100%',
                        height: 1,
                      }}
                    />
                    <View
                      style={{
                        paddingTop: 14,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      <TouchableOpacity onPress={() => handleAddFav()}>
                        <IconStar color={activeStar ? '#2665EF' : '#A0A0A0'} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ paddingHorizontal: 24 }}
                        onPress={handleShare}>
                        <IconShare />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleSpeakTextOutput}>
                        <IconVoice />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleCopy}>
                        <View style={{ paddingLeft: 24 }}>
                          <IconCopy />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  textareaContainer: {
    height: 165,
    padding: 0,
    margin: 0,
  },
});
