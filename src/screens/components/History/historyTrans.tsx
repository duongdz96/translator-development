import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

import usePreferenceActionsContext from '~/hooks/usePreferenceActionsContext';
import usePreferenceContext from '~/hooks/usePreferenceContext';
import useTokenGCP from '~/hooks/useTokenGCP';

import IconStar from '~/resources/Icons/IconStar';
import IconVoice from '~/resources/Icons/IconVoice';

import axios from 'axios';
import { RootNavigatorNavProps } from '~/navigation/RootNavigator';

interface IProps {
  title?: string;
  description: string;
  active: boolean;
  time: string;
  id: string;
  inputLanguage: any;
  outputLanguage: any;
  onRemove?: () => void;
  onAddItem?: () => void;
  dataRouter: boolean;
}
const HistoryTrans = (props: IProps): JSX.Element => {
  const {
    title,
    description,
    active,
    time,
    id,
    onRemove,
    inputLanguage,
    outputLanguage,
    onAddItem,
    dataRouter,
  } = props;
  const [activeStar, setActiveStar] = useState(active);
  const actionButton = usePreferenceContext();
  const actionMethod = usePreferenceActionsContext();
  const dataFavorite = actionButton.result.Favorite;
  const dataHistory = actionButton.result.History;
  const dataDetail = {
    title,
    description,
    inputLanguage,
    outputLanguage,
    activeStar,
    id,
    time,
    dataRouter,
  };
  const navigation = useNavigation<RootNavigatorNavProps>();
  const token = useTokenGCP();
  const handleAddFav = async () => {
    if (title && description && time) {
      const dataFavoriteNew = {
        title: title,
        description: description,
        time: time,
        id: id,
        active: true,
        inputLanguage: inputLanguage,
        outputLanguage: outputLanguage,
      };
      const isAdd = dataFavorite.find((obj) => obj.id === id);
      if (!activeStar) {
        if (!isAdd) {
          setActiveStar(true);
          onAddItem(id);
          const data = dataFavorite.push(dataFavoriteNew);
          await AsyncStorage.setItem(
            'dataFavorite',
            JSON.stringify(dataFavorite),
          );
        }
      } else {
        const routes = navigation.getState()?.routes;
        const prevRoute = routes[routes.length - 1]; // -2 because -1 is the current route
        const dataPrevRoute = prevRoute.name;
        if (dataPrevRoute !== 'Favorite') {
          setActiveStar(false);
        }
        const newItems = dataHistory.map((item) => {
          if (item.id === id) {
            return { ...item, active: false };
          }
          return item;
        });
        await AsyncStorage.setItem('dataHistory', JSON.stringify(newItems));
        actionMethod.setActionHistory?.(newItems);
        onRemove(id);
      }
    }
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

  const handlePlayVoice = async () => {
    if (isPlaying) {
      stopSound();
    } else {
      fetchAndPlayTTS(description, outputLanguage.countyCode);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => [
          navigation.navigate('DetailHistory', dataDetail),
          stopSound(),
        ]}
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          marginBottom: 12,
        }}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{ width: '85%' }}>
            <Text
              numberOfLines={2}
              style={{ fontSize: 16, fontWeight: '500', color: '#000000' }}>
              {title}
            </Text>
            <View style={{ paddingTop: 8 }}>
              <Text
                numberOfLines={2}
                style={{ fontSize: 16, fontWeight: '300', color: '#000000' }}>
                {description}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: '10%',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => handleAddFav()}>
              <View style={{ paddingBottom: 8 }}>
                <IconStar color={activeStar ? '#2665EF' : '#A0A0A0'} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlayVoice}>
              <IconVoice />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingLeft: 16, paddingBottom: 12 }}>
          <Text style={{ color: '#A0A0A0' }}>{time}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default HistoryTrans;

const styles = StyleSheet.create({});
