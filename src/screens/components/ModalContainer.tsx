import React from 'react';

import ExampleModal from '~/screens/components/ModalComponent/ExampleModal';
import FilePermissionModal from '~/screens/components/ModalComponent/FilePermissionModal';

import VoicePermissionModal from './ModalComponent/VoicePermissionModal';
import LanguageModal from './ModalComponent/LanguageModal';
import ErrorTranslation from './ModalComponent/ErrorTranslation';


const ModalContainer = (): JSX.Element => {
  return (
    <>
      <ExampleModal />
      <FilePermissionModal/>
      <VoicePermissionModal />
      <LanguageModal/>
      <ErrorTranslation/>

    </>
  );
};

export default ModalContainer;
