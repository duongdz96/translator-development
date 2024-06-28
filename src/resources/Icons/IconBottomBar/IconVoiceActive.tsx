import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function IconVoiceActive(props) {
  return (
    <Svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <Path
        d='M15.5 5.5C15.5 3.567 13.933 2 12 2C10.067 2 8.5 3.567 8.5 5.5V12C8.5 13.933 10.067 15.5 12 15.5C13.933 15.5 15.5 13.933 15.5 12V5.5Z'
        fill='#2665EF'
        stroke='#2665EF'
        stroke-width='1.66667'
        stroke-linejoin='round'
      />
      <Path
        d='M4.5 11.5C4.5 15.642 7.858 19 12 19M12 19C16.142 19 19.5 15.642 19.5 11.5M12 19V22'
        stroke='#2665EF'
        stroke-width='1.66667'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
}

export default IconVoiceActive;
