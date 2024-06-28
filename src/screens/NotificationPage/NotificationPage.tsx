import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {
  PERMISSIONS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';

import useModalManager from '~/hooks/useModalManager';
import usePreferenceContext from '~/hooks/usePreferenceContext';
import useTokenGCP from '~/hooks/useTokenGCP';

import IconDropdown from '~/resources/Icons/IconDropdown';
import IconSwap from '~/resources/Icons/IconSwap';
import { useAppTheme } from '~/resources/theme';

import moment from 'moment';
import { RootNavigatorNavProps } from '~/navigation/RootNavigator';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const NotificationPage = (): JSX.Element => {
  const actionButton = usePreferenceContext();
  const [dataLanguageInput, setDataLanguageInput] = useState(
    actionButton.result.languageSelect,
  );
  const [dataLanguageOutPut, setDataLanguageOutPut] = useState(
    actionButton.result.languageSelectOutput,
  );
  const { t } = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<RootNavigatorNavProps>();
  const { openModal } = useModalManager();
  const token = useTokenGCP();
  const [files, setFiles] = useState([]);
  const styleContainer = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        flex: 1,
        backgroundColor: '#EDEDED',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      },
    ],
    [theme],
  );
  const OsVer = Platform.constants['Release'];
  // Request
  useEffect(() => {
    if (Platform.OS === 'ios') {
      checkMultiple([PERMISSIONS.IOS.PHOTO_LIBRARY, PERMISSIONS.IOS.CAMERA])
        .then((result) => {
          console.log(result);
          if (
            result[PERMISSIONS.IOS.PHOTO_LIBRARY] !== 'granted' ||
            result[PERMISSIONS.IOS.CAMERA] !== 'granted'
          ) {
            requestMultiple([
              PERMISSIONS.IOS.PHOTO_LIBRARY,
              PERMISSIONS.IOS.CAMERA,
            ]).then((result) => {
              console.log('result request ', result);
            });
          }
        })
        .catch((error) => {
          console.log(
            'Có lỗi xảy ra khi kiểm tra quyền truy cập file: ',
            error,
          );
        });
    } else {
      if (OsVer >= 13) {
        checkMultiple([
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        ])
          .then((result) => {
            console.log(result);
            if (
              result[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] !== 'granted' &&
              result[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] !== 'granted'
            ) {
              requestMultiple([
                PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
                PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
              ]).then((result) => {
                console.log('resultt', result);
              });
            }
          })
          .catch((error) => {
            console.log(
              'Có lỗi xảy ra khi kiểm tra quyền truy cập file: ',
              error,
            );
          });
      } else {
        checkMultiple([
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ])
          .then((result) => {
            console.log(result, 'rs');
            if (
              result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] !== 'granted' ||
              result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !== 'granted'
            ) {
              requestMultiple([
                PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
              ]).then((result) => {
                console.log('result request ', result);
              });
            }
          })
          .catch((error) => {
            console.log(
              'Có lỗi xảy ra khi kiểm tra quyền truy cập file: ',
              error,
            );
          });
      }
    }
  }, []);
  // Fecth Data
  useEffect(() => {
    const fetchFiles = async () => {
      let storedFiles = await getData();
      if (storedFiles) {
        setFiles(storedFiles);
      }
    };
    fetchFiles();
  }, []);
  const storeData = async (
    value: {
      uri: string;
      name: string | null;
      copyError?: string | undefined;
      fileCopyUri: string | null;
      type: string | null;
      size: number | null;
    }[],
  ) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@storage_Key', jsonValue);
    } catch (e) { }
  };
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      return [];
    }
  };

  React.useEffect(() => {
    const logEventAnalytics = async () => {
      await analytics().logEvent('File');
    };
    logEventAnalytics();
  }, []);

  const pickFiles = async () => {
    //Check before
    checkPermission().then(async (result) => {
      if (result) {
        try {
          const result = await DocumentPicker.pickSingle({
            type: [DocumentPicker.types.pdf, DocumentPicker.types.docx],
            copyTo: 'documentDirectory',
          });
          const fileUri = result.fileCopyUri;

          const newFile = { ...result };

          //Change if duplicate name 

          
          //Change if duplicate name 

          function generateNewFileName(baseName: string, counter: number) {
            const fileName = counter > 0 ? `${baseName}(${counter})` : baseName;
            const newFileName = `${fileName}.${newFile.extension}`;
            if (files.some(file => file.name === newFileName)) {
              return generateNewFileName(baseName, counter + 1);
            }
            return newFileName;
          }
          
          const sameNameFiles = files.filter(file => file.name === newFile.name);
          if (sameNameFiles.length > 0) {
            const baseName = newFile.name.substring(0, newFile.name.lastIndexOf('.'));
            const newFileExtension = newFile.name.substring(newFile.name.lastIndexOf('.') + 1);
            newFile.extension = newFileExtension;
            newFile.name = generateNewFileName(baseName, 1);
          }



          newFile.currentTime = moment().format('h:mm A');
          newFile.currentSize = formatBytes(newFile.size);
          newFile.currentDate = moment().format('DD MMM YYYY');

          const updatedFiles = [...files, newFile];
          setFiles(updatedFiles);
          storeData(updatedFiles);
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            // Cancel
          } else {
            throw err;
          }
        }
      } else {
        openModal('FilePermissionModal');
      }
    });
  };
  const ItemFile = ({ item }) => {
    if (item.name.endsWith('.doc') || item.name.endsWith('.docx')) {
      item.image = require('../../resources/images/FilePage/DOC.png');
    } else if (item.name.endsWith('.pdf')) {
      item.image = require('../../resources/images/FilePage/PDF.png');
    }

    item.inputCodeLanguage = dataLanguageInput.countyCode;
    item.targetCodeLanguage = dataLanguageOutPut.countyCode;

    const handleFile = async () => {
      if (dataLanguageInput.countyCode === dataLanguageOutPut.countyCode) {
        openModal('LanguageModal');
        return;
      }
      try {
        navigation.navigate('SelectFile', { file: item, token: token });
      } catch (error) {
        console.error('Error handling file upload or translation:', error);
      }
    };
    return (
      <TouchableOpacity
        onPress={handleFile}
        style={{
          width: '100%',
          height: 64,
          flexDirection: 'row',
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#D9D9D9',
          borderRadius: 10,
          paddingLeft: 10,
          alignItems: 'center',
          marginTop: 5,
        }}>
        <Image
          source={item.image}
          style={{
            width: 45,
            height: 45,
          }}
        />

        <View
          style={{
            justifyContent: 'flex-start',
            marginLeft: 10,
            width: '80%',
          }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={{
              color: '#000000',
              fontSize: 16,
              fontWeight: '400',
            }}>
            {item.name}
          </Text>

          <Text
            style={{
              color: '#A0A0A0',
              fontSize: 12,
              fontWeight: '400',
            }}>
            {item.currentSize} - {item.currentDate}, {item.currentTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const HaveFile = ({ }) => {
    return (
      <View>
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 360,
              marginBottom: 200,
            }}>
            {files
              .slice()
              .reverse()
              .map((item, index) => (
                <ItemFile key={index} item={item} />
              ))}
          </View>
        </View>
      </View>
    );
  };
  const NotHaveFile = ({ }) => {
    return (
      <View>
        <Text
          style={{
            color: '#82828B',
            fontSize: 14,
            fontWeight: '400',
            marginTop: 10,
            textAlign: 'center',
          }}>
          {t('Please upload any files you want to translate')}
        </Text>
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={pickFiles}
            style={{
              width: 96,
              height: 96,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 220,
            }}>
            <Image
              source={require('~/resources/images/FilePage/UploadFile.png')}
              style={{ height: 64, width: 88 }}
            />
            <Text
              style={{
                color: '#2665EF',
                fontSize: 14,
                fontWeight: '400',
                textAlign: 'center',
                fontStyle: 'italic',
              }}>
              {t('Click here')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const ButtonPickFile = ({ }) => {
    return (
      <TouchableOpacity
        onPress={pickFiles}
        style={{
          width: 40,
          height: 40,
          position: 'absolute',
          zIndex: 5,
          left: '85%',
          top: '85%',
        }}>
        <Image
          style={{ flex: 1 }}
          source={require('~/resources/images/FilePage/UploadFileButton.png')}
        />
      </TouchableOpacity>
    );
  };
  function formatBytes(bytes) {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0,
      n = parseInt(bytes, 10) || 0;
    while (n >= 1000 && ++l) {
      n = n / 1024;
    }

    return n.toFixed(n < 10 && l > 0 ? 2 : 0) + ' ' + units[l];
  }
  function checkEmptyFiles(files) {
    if (files.length === 0) return false;
    else return true;
  }
  async function checkPermission() {
    if (Platform.OS === 'ios') {
      const result = await checkMultiple([
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        PERMISSIONS.IOS.CAMERA,
      ]);

      console.log(result);

      if (
        result[PERMISSIONS.IOS.PHOTO_LIBRARY] !== 'granted' ||
        result[PERMISSIONS.IOS.CAMERA] !== 'granted'
      ) {
        const requestResult = await requestMultiple([
          PERMISSIONS.IOS.PHOTO_LIBRARY,
          PERMISSIONS.IOS.CAMERA,
        ]);

        return (
          requestResult[PERMISSIONS.IOS.PHOTO_LIBRARY] === 'granted' &&
          requestResult[PERMISSIONS.IOS.CAMERA] === 'granted'
        );
      } else {
        return false;
      }
    } else {
      if (OsVer >= 13) {
        const result = await checkMultiple([
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        ]);

        console.log(result);

        if (
          result[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] === 'granted' &&
          result[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] === 'granted'
        ) {
          const requestResult = await requestMultiple([
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
            PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
          ]);

          return (
            requestResult[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
            'granted' &&
            requestResult[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] === 'granted'
          );
        } else {
          return false;
        }
      } else {
        const result = await checkMultiple([
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ]);

        console.log(result, 'rs');

        if (
          result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === 'granted' &&
          result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted'
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  useEffect(() => {
    setDataLanguageInput(actionButton.result.languageSelect);
    setDataLanguageOutPut(actionButton.result.languageSelectOutput);
  }, [
    actionButton.result.languageSelect,
    actionButton.result.languageSelectOutput,
  ]);

  function swapLangue() {
    const temp = dataLanguageInput;
    setDataLanguageInput(dataLanguageOutPut);
    setDataLanguageOutPut(temp);
    console.log('swaped');
  }
  return (
    <SafeAreaView style={styleContainer}>
      <View
        style={{
          flex: 1,
          width: '100%',
          paddingHorizontal: 24,
          paddingTop: Platform.select({
            ios: 0,
            android: 40,
          }),
        }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              color: '#000000',
              fontSize: 24,
              fontWeight: '700',
            }}>
            {t(' Files Translator')}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 30,
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
        </View>

        {checkEmptyFiles(files) && (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <Text
              style={{
                color: '#82828B',
                fontSize: 16,
                fontWeight: '400',
                marginTop: 20,
              }}>
              {t('Select a file')}
            </Text>
          </View>
        )}

        <View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {checkEmptyFiles(files) ? <HaveFile /> : <NotHaveFile />}
          </ScrollView>
        </View>
      </View>

      {checkEmptyFiles(files) && <ButtonPickFile />}
    </SafeAreaView>
  );
};

export default NotificationPage;
