import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Modal } from 'react-native-paper';

import useModalManager from '~/hooks/useModalManager';
import { useOrientation } from '~/hooks/useOrientation';
import usePreferenceActionsContext from '~/hooks/usePreferenceActionsContext';

import { useAppTheme } from '~/resources/theme';

const ErrorTranslationContent = ({
  onCloseModal,
}: {
  onCloseModal: () => void;
}): JSX.Element => {
  const actionMethod = usePreferenceActionsContext();
  const { isPortrait, ORIENTATION_WIDTH, ORIENTATION_HEIGH } = useOrientation();
  const [showAlert, setShowAlert] = useState(false);
  const theme = useAppTheme();
  const { t } = useTranslation();

  const modalContainer = useMemo<StyleProp<ViewStyle>>(
    () => ({
      width: isPortrait ? ORIENTATION_WIDTH / 1.2 : ORIENTATION_HEIGH / 1.2,

      paddingVertical: 16,
      borderRadius: 12,
    }),
    [ORIENTATION_WIDTH],
  );

  return (
    
    <View style={styles.modal}>
        <Text style={{
            fontFamily: 'MerriweatherSans-Bold',
            fontSize: 24,
            fontWeight: '700',
            color: Platform.select({
              ios: '#000000',
              android: '#2665EF'
            }),
            marginBottom: Platform.select({
              ios: 4,
              android: 4,
            }),
        }}>{t("Error")}</Text>
        <Text style={{
            fontFamily: 'MerriweatherSans-Bold',
            fontWeight: Platform.select ({
              ios: '400',
              android: '400'
            }),
            fontSize: 16,
            color: Platform.select({
              ios: '#82828B',
              android: '#000000'
            })
        }}>{t("Error when translation !")}</Text>

        <Text style={{
            fontFamily: 'MerriweatherSans-Bold',
            fontWeight: Platform.select ({
              ios: '400',
              android: '400'
            }),
            fontSize: 16,
            color: Platform.select({
              ios: '#82828B',
              android: '#000000'
            })
        }}>{t("Please try again !")}</Text>
        
        <TouchableOpacity style={{
          borderWidth: Platform.select({
            ios: 2,
            android: 0,
          }),
          borderRightWidth: Platform.select({
            ios: 1,
            android: 0,
          }),
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderColor:'#82828B',
          width: (SCREEN_WIDTH - 48),
          height: 54,
          position: 'absolute',
          bottom: 0,
          left: 0,
          justifyContent: 'center',
          alignContent: 'center'
        }} activeOpacity={1} onPress={onCloseModal}>
          <Text style={{
            alignSelf: 'center',
            fontFamily: 'MerriweatherSans-Bold',
            fontWeight: '400',
            fontSize: 20,
            color: '#2665EF'
          }}>{t("Got it")}</Text>
        </TouchableOpacity>
    </View>
  );
};

const ErrorTranslation = (): JSX.Element | null => {
  const { isOpen, closeModal } = useModalManager('ErrorTranslation');
  const visible = isOpen('ErrorTranslation');

  const onClose = (): void => {
    closeModal('ErrorTranslation');
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      contentContainerStyle={styles.modal}>
      {visible ? <ErrorTranslationContent onCloseModal={onClose} /> : null}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    // justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH - 48,
    height: 173,
    borderRadius: Platform.select({
      ios: 12,
      android: 4,
    }),
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',

    paddingTop: 16,
  },
});

export default ErrorTranslation;
