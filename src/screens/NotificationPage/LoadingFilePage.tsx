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
import { SkypeIndicator } from 'react-native-indicators';
import { useAppTheme } from '~/resources/theme';
import { RootNavigatorNavProps } from '~/navigation/RootNavigator';
import axios from 'axios';
import moment from 'moment';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const LoadingFilePage = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<RootNavigatorNavProps>();
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
  const route = useRoute();
  const {file} = route.params;
  // console.log(file);

//Set file type

  let fileType = '';
  if (file.name.endsWith('.doc') ) {
    fileType = 'application/msword';
  }  else if (file.name.endsWith('.docx')) {
    fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  else if (file.name.endsWith('.pdf')) {
    fileType = 'application/pdf';
  }

//Set file name
  let currentDate = moment().format("DD-MMM-YYYY");
  let currentTime = moment().format('h:mm-A');
  let fileNameGS = file.name.split('.').slice(0, -1).join('.') +'-'+ file.targetCodeLangueage+ '-' +currentTime + '-' +currentDate;
  let endWith = file.name.split('.').pop();
  
  //View PDF

  const  ViewPDF = async () => {
    const url =
      "https://www.africau.edu/images/default/sample.pdf";
    const f2 = url.split("/");

    const fileName = f2[f2.length - 1];
    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const options = {
      fromUrl: url,
      toFile: localFile,
    };
    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile))
      .then(() => {
        console.log('ok');
      })
      .catch((error) => {
        console.log(error);
      });
  }; 


  async function loadDataAndNavigate({item}) {
    try {
      // await handleFileUpload();
      // await handleFileTranslation();  
      navigation.navigate('SelectFile', {file : item });
    } catch (error) {
      console.error(error);
    }
  }

useEffect(()=>{
  loadDataAndNavigate({ item: file });
},[])
  
  return (
    <SafeAreaView style={styleContainer}>
     <View style={{width: '100%'}}> 
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

      <View style={{ width: '100%', height :80, marginTop : 200}}>
        <SkypeIndicator color={'#0057E7'} size={80}  />
      </View>
     
      <View>
        <Text 
          style={{ fontSize: 16,fontWeight: '700', color: '#000000', marginTop: 5}} 
          >
          Processing File
        </Text>
      </View>

      <View>
        <Text 
          style={{ fontSize: 20,fontWeight: '300', color: '#000000', marginTop: 5}} 
          >
          {file.name}
        </Text>
      </View>
      
      <TouchableOpacity
      onPress={navigation.goBack}
        style={{backgroundColor: '#FFFFFF', width: 154, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#2665EF', justifyContent: 'center', alignItems: 'center', marginTop: 20}}
      >
        <Text
          style={{color: '#2665EF', fontSize: 14, fontWeight: '400' }}
        >
          Cancel
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoadingFilePage;

const styles = StyleSheet.create({

});