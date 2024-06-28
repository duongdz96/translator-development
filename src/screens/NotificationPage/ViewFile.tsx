import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
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

import { useAppTheme } from '~/resources/theme';

import { RootNavigatorNavProps } from '~/navigation/RootNavigator';

import Pdf from 'react-native-pdf';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';



const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ViewFile = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<RootNavigatorNavProps>();
  const route = useRoute();
  const { file } = route.params;
  const convertedName = file.convertedName;
  const fileName = convertedName;
  const originalFileType = file.type;
  let fileType = originalFileType;
  if (originalFileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    fileType = "docx";
  }
  const styleContainer = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        flex: 1,
        backgroundColor: '#EDEDED',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        alignItems: 'center'
      },
    ],
    [theme],
  );
  return (
    <SafeAreaView style={styleContainer}>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ width: 37, height: 37, position: 'absolute', zIndex: 3, marginTop: 50, borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderColor: '#D9D9D9', borderRadius: 20, left: 15 }}
      >
        <Image
          style={{ width: 9, height: 17 }}
          source={require('~/resources/images/FilePage/IconBack.png')}
        />
      </TouchableOpacity>

      <View style={{ width: '100%', alignItems: 'center',}}>
        <Text
          style={{
            color: '#000000',
            fontSize: 24,
            fontWeight: '700',
            marginTop: 50,
            width: '60%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            textAlign: 'center',
            justifyContent: 'flex-start',
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {file.name}
        </Text>
      </View>

      <View style={{ marginTop: 20, width: '100%', backgroundColor: '#D9D9D9', alignItems: 'center', paddingTop: 20, }}>
        <Pdf
          trustAllCerts={false}
          source={{
            uri: file.filetype === "docx" || file.filetype === "doc"
              ? `${file.urlDOC}`
              : `https://storage.googleapis.com/demo_translation_app/OutputFile/demo_translation_app_InputFile_${file.convertedName}_${file.timestamp}_${file.targetCodeLanguage}_translations.${file.filetype}`,

            cache: true
          }}
          style={{ width: 350, height: WINDOW_HEIGHT, }}
          showsHorizontalScrollIndicator={true}
          enableDoubleTapZoom={true}
        />
      </View>


    </SafeAreaView>
  );
};

export default ViewFile;

const styles = StyleSheet.create({

});