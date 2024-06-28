import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import RNFS from 'react-native-fs';
import { SkypeIndicator } from 'react-native-indicators';

import useModalManager from '~/hooks/useModalManager';

import { useAppTheme } from '~/resources/theme';

import axios from 'axios';
import { Buffer } from 'buffer';
import unidecode from 'unidecode';
import { RootNavigatorNavProps } from '~/navigation/RootNavigator';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const SelectFile = (): JSX.Element => {
  const { openModal } = useModalManager();
  const { t } = useTranslation();
  const theme = useAppTheme();
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const { file } = route.params;
  const fileName = file.name;
  const originalFileType = file.type;
  let fileType = originalFileType;
  const { token } = route.params;
  if (
    originalFileType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    fileType = 'docx';
  }
  const navigation = useNavigation<RootNavigatorNavProps>();
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
  useEffect(() => {
    const fetchData = async () => {
      await uplaoadANDtranslateANDconvert();
      setIsLoading(false);
    };

    fetchData();
  }, []);
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const handleUploadFile = async (file) => {
    const fileNameParts = file.name.split('.');
    const extension = fileNameParts.pop();
    const baseName = fileNameParts.join('.');
    const convertedName = convertToEnglish(baseName);
    file.convertedName = convertedName;
    file.timestamp = timestamp;
    const fileContent = await RNFS.readFile(
      `file://${file.fileCopyUri}`,
      'base64',
    );
    const binaryData = Buffer.from(fileContent, 'base64');
    const bucketName = 'demo_translation_app';
    const objectName = `InputFile/${encodeURIComponent(
      convertedName,
    )}_${timestamp}.${extension}`;
    const config = {
      method: 'post',
      url: `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${objectName}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `${file.type}`,
      },
      data: binaryData,
    };

    try {
      const response = await axios.request(config);
      const gsutilUrl = `gs://${bucketName}/${objectName}`;
      return gsutilUrl;
    } catch (error) {
      openModal('ErrorTranslation');
      navigation.goBack();
    }
  };
  const handleFileTranslation = async (gsutilUrl) => {
    try {
      const response = await axios.post(
        'https://translation.googleapis.com/v3/projects/gen-lang-client-0531642691/locations/global:translateDocument',
        {
          source_language_code: file.inputCodeLanguage,
          target_language_code: file.targetCodeLanguage,
          document_input_config: {
            gcsSource: {
              inputUri: gsutilUrl,
            },
          },
          document_output_config: {
            gcsDestination: {
              outputUriPrefix: `gs://demo_translation_app/OutputFile/`,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-goog-user-project': 'gen-lang-client-0531642691',
          },
        },
      );
    } catch (error) {
      openModal('ErrorTranslation');
      navigation.goBack();
    }
  };
  const convertPDF = async (item) => {
    let data = JSON.stringify({
      Parameters: [
        {
          Name: 'File',
          FileValue: {
            Url: `https://storage.googleapis.com/demo_translation_app/OutputFile/demo_translation_app_InputFile_${item.convertedName}_${item.timestamp}_${item.targetCodeLanguage}_translations.${item.filetype}`,
          },
        },
        {
          Name: 'StoreFile',
          Value: true,
        },
      ],
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://v2.convertapi.com/convert/doc/to/pdf?Secret=YoMcPEyFqDuqqzIC&StoreFile=true',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    try {
      const response = await axios(config);
      const fileUrl = response.data.Files[0].Url;
      return fileUrl;
    } catch (error) {
      console.log('loi khi convert');
      return null;
    }
  };
  async function checkToConvert() {
    if (file.filetype === 'doc' || file.filetype === 'docx') {
      try {
        const a = await convertPDF(file);
        file.urlDOC = a;
      } catch (error) {
        console.log('loi khi check DOC');
      }
    }
  }
  async function uplaoadANDtranslateANDconvert() {
    const gsutilUrl = await handleUploadFile(file);
    await handleFileTranslation(gsutilUrl);
    file.filetype = file.name.split('.').pop();
    await checkToConvert();
  }
  const ItemFile = ({ item }) => {
    if (item.name.endsWith('.doc') || item.name.endsWith('.docx')) {
      item.image = require('../../resources/images/FilePage/DOC.png');
    } else if (item.name.endsWith('.pdf')) {
      item.image = require('../../resources/images/FilePage/PDF.png');
    }
    const handleFile = async () => {
      // await checkToConvert();
      navigation.navigate('ViewFile', { file: item });
    };
    return (
      <TouchableOpacity
        onPress={handleFile}
        style={{
          width: 382,
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
  function convertToEnglish(str) {
    const convertedStr = unidecode(str).toLowerCase().replace(/\s+/g, '');

    return convertedStr;
  }
  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#EDEDED',
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          alignItems: 'center',
        }}>
        <View style={{ width: '100%' }}>
          <Text
            style={{
              color: '#000000',
              fontSize: 24,
              textAlign: 'center',
              fontWeight: '700',
              marginTop: 50,
            }}>
            {t('File Translator')}
          </Text>
        </View>

        <View style={{ width: '100%', height: 80, marginTop: 200 }}>
          <SkypeIndicator color={'#0057E7'} size={80} />
        </View>

        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#000000',
              marginTop: 5,
            }}>
            Processing File
          </Text>
        </View>

        <View style={{ width: '80%', alignItems: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={{
              fontSize: 20,
              fontWeight: '300',
              color: '#000000',
              marginTop: 5,
            }}>
            {file.name}
          </Text>
        </View>

        <TouchableOpacity
          onPress={navigation.goBack}
          style={{
            backgroundColor: '#FFFFFF',
            width: 154,
            height: 48,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#2665EF',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Text style={{ color: '#2665EF', fontSize: 14, fontWeight: '400' }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styleContainer}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Text
          style={{
            color: '#000000',
            fontSize: 24,
            fontWeight: '700',
            marginTop: 50,
          }}>
          {t('File Translator')}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          width: 37,
          height: 37,
          position: 'absolute',
          marginTop: 50,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#D9D9D9',
          borderRadius: 20,
          left: 15,
        }}>
        <Image
          style={{ width: 9, height: 17 }}
          source={require('~/resources/images/FilePage/IconBack.png')}
        />
      </TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Image
          style={{ width: 240, height: 256 }}
          source={require('~/resources/images/FilePage/Frame48095643.png')}
        />
      </View>

      <View style={{ alignItems: 'center' }}>
        <ItemFile item={file} />
      </View>
    </SafeAreaView>
  );
};
export default SelectFile;
const styles = StyleSheet.create({});
