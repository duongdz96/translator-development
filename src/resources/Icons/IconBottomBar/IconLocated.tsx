import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function IconLocated(props) {
  return (
    <Svg
      width='18'
      height='22'
      viewBox='0 0 18 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <Path
        d='M12.5 4.5C12.5 2.567 10.933 1 9 1C7.067 1 5.5 2.567 5.5 4.5V11C5.5 12.933 7.067 14.5 9 14.5C10.933 14.5 12.5 12.933 12.5 11V4.5Z'
        stroke='#82828B'
        stroke-width='1.66667'
        stroke-linejoin='round'
      />
      <Path
        d='M1.5 10.5C1.5 14.642 4.858 18 9 18M9 18C13.142 18 16.5 14.642 16.5 10.5M9 18V21'
        stroke='#82828B'
        stroke-width='1.66667'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
}

export default IconLocated;
