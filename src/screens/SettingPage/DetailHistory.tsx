import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Clipboard,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

import usePreferenceActionsContext from '~/hooks/usePreferenceActionsContext';
import usePreferenceContext from '~/hooks/usePreferenceContext';
import useTokenGCP from '~/hooks/useTokenGCP';

import IconBack from '~/resources/Icons/IconBack';
import IconCopy from '~/resources/Icons/IconCopy';
import IconStar from '~/resources/Icons/IconStar';
import IconVoice from '~/resources/Icons/IconVoice';
import { useAppTheme } from '~/resources/theme';

import axios from 'axios';
import {
  DetailHistoryRouteProps,
  RootNavigatorNavProps,
} from '~/navigation/RootNavigator';

const DetailHistory = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const actionButton = usePreferenceContext();
  const actionMethod = usePreferenceActionsContext();
  const dataFavorite = actionButton.result.Favorite;
  const dataHistory = actionButton.result.History;
  const router = useRoute<DetailHistoryRouteProps>();
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const {
    title,
    inputLanguage,
    outputLanguage,
    description,
    activeStar,
    id,
    time,
    dataRouter,
  } = router.params;
  const [Active, setActive] = useState(activeStar);

  const navigation = useNavigation<RootNavigatorNavProps>();
  const token = useTokenGCP();
  const handleCopyInput = () => {
    Clipboard.setString(title);
    ToastAndroid.show('Text copied to clipboard!', ToastAndroid.SHORT);
  };
  const handleCopyOutput = () => {
    Clipboard.setString(description);
    ToastAndroid.show('Text copied to clipboard!', ToastAndroid.SHORT);
  };
  const createFile = async (path: string, data: string) => {
    try {
      return await RNFS.writeFile(path, data, 'base64');
    } catch (err) {
      console.warn(err);
    }

    return null;
  };

  const queue = [];
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

  const handleSpeakTextInput = async () => {
    if (isPlaying) {
      stopSound();
    } else {
      fetchAndPlayTTS(title, inputLanguage.countyCode);
    }
  };

  const handleSpeakTextOutput = async () => {
    if (isPlaying) {
      stopSound();
    } else {
      fetchAndPlayTTS(description, outputLanguage.countyCode);
    }
  };

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
  const handleAddFav = async () => {
    const dataFavoriteNew = {
      title: title,
      description: description,
      time: time,
      id: id,
      active: true,
      inputLanguage: inputLanguage,
      outputLanguage: outputLanguage,
    };
    if (Active) {
      setActive(false);
      const newArray = dataFavorite.filter((obj) => obj.id !== id);
      actionMethod.setActionFavorite?.(newArray);
      await AsyncStorage.setItem('dataFavorite', JSON.stringify(newArray));
      const newItems = dataHistory.map((item) => {
        if (item.id === id) {
          return { ...item, active: false };
        }
        return item;
      });
      actionMethod.setActionHistory?.(newItems);
      await AsyncStorage.setItem('dataHistory', JSON.stringify(newItems));
    } else {
      setActive(true);
      const newItems = dataHistory.map((item) => {
        if (item.id === id) {
          return { ...item, active: true };
        }
        return item;
      });
      const data = dataFavorite.push(dataFavoriteNew);
      await AsyncStorage.setItem('dataFavorite', JSON.stringify(dataFavorite));
      await AsyncStorage.setItem('dataHistory', JSON.stringify(newItems));
      actionMethod.setActionHistory?.(newItems);
    }
  };
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2]; // -2 because -1 is the current route
  const dataPrevRoute = prevRoute.name;
  const dataRouters = dataRouter ? dataRouter : false;
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
            onPress={() => [
              navigation.replace(dataPrevRoute, dataRouter),
              stopSound(),
            ]}>
            <IconBack width={24} height={24} />
          </TouchableOpacity>
          <Text
            style={{
              color: '#000000',
              fontSize: 24,
              textAlign: 'center',
              fontWeight: '700',
            }}>
            {t('Translation')}
          </Text>
          <View />
        </View>
        <View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                padding: 12,
                width: 154,
                height: 48,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View style={{ paddingRight: 16 }}>
                  <Image
                    source={inputLanguage.image}
                    style={{ width: 24, height: 16 }}
                  />
                </View>
                <Text style={{ color: '#000000', fontWeight: '700' }}>
                  {inputLanguage.name}
                </Text>
              </View>
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
                  height: SCREEN_HEIGHT * 0.3,
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
                        fontSize: 14.2,
                        lineHeight: 18,
                      }}>
                      {title}
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
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 24,
            }}>
            <View
              style={{
                padding: 12,
                width: 154,
                height: 48,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#2665EF',
                borderRadius: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View style={{ paddingRight: 16 }}>
                  <Image
                    source={outputLanguage.image}
                    style={{ width: 24, height: 16 }}
                  />
                </View>
                <Text style={{ color: '#ffffff', fontWeight: '700' }}>
                  {outputLanguage.name}
                </Text>
              </View>
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
                  height: SCREEN_HEIGHT * 0.3,
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
                        fontSize: 14.2,
                        lineHeight: 18,
                      }}>
                      {description}
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
                    <TouchableOpacity
                      onPress={() => handleAddFav()}
                      style={{ paddingRight: 24 }}>
                      <IconStar color={Active ? '#2665EF' : '#A0A0A0'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSpeakTextOutput}>
                      <IconVoice />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCopyOutput}>
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
      </View>
    </SafeAreaView>
  );
};

export default DetailHistory;

const styles = StyleSheet.create({
  textareaContainer: {
    height: 160,
    padding: 5,
  },
});
