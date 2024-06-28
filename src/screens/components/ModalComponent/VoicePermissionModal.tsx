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

const VoicePermissionModalContent = ({
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
            color: '#000000',
            marginBottom: 4,
        }}>{t("Can't access microphone" )}</Text>
        <Text style={{
            fontFamily: 'MerriweatherSans-Bold',
            fontWeight: '400',
            fontSize: 16,
            color: '#82828B'
        }}>{("To use the micro, you need to allow")}</Text>
        <Text style={{
            fontFamily: 'MerriweatherSans-Bold',
            fontWeight: '400',
            fontSize: 16,
            color: '#82828B',
            marginBottom: 20,
        }}>{t("GlobalTrans to access it")}</Text>

        <TouchableOpacity style={{
          borderWidth: 2,
          borderRightWidth: 1,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderColor:'#82828B',
          width: (SCREEN_WIDTH - 48) / 2,
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
            fontSize: 14,
            color: '#000000'
          }}>{("Cancel")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          borderWidth: 2,
          borderBottomWidth: 0,
          borderRightWidth: 0,
          borderLeftWidth: 1,
          borderColor:'#82828B',
          width: (SCREEN_WIDTH - 48) / 2,
          height: 54,
          position: 'absolute',
          bottom: 0,
          right: 0,
          justifyContent: 'center',
          alignContent: 'center'
        }} activeOpacity={1} onPress={() => {Platform.OS === 'ios' ? Linking.openURL('app-settings: '): Linking.openSettings()}}>
          <Text style={{
            alignSelf: 'center',
            fontFamily: 'MerriweatherSans-Bold',
            fontWeight: '400',
            fontSize: 14,
            color: '#2665EF'
          }}>{("Go to setting")}</Text>
        </TouchableOpacity>
    </View>
  );
};

const VoicePermissionModal = (): JSX.Element | null => {
  const { isOpen, closeModal } = useModalManager('VoicePermissionModal');
  const visible = isOpen('VoicePermissionModal');

  const onClose = (): void => {
    closeModal('VoicePermissionModal');
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      contentContainerStyle={styles.modal}>
      {visible ? <VoicePermissionModalContent onCloseModal={onClose} /> : null}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    // justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH - 48,
    height: 173,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',

    paddingTop: 16,
  },
});

export default VoicePermissionModal;
