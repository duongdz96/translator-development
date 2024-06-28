import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import { withIcon } from '~/libs/IconDecorator';

const IconSwap = (): JSX.Element => {
  return (
    <Svg
      width='24'
      height='22'
      viewBox='0 0 24 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <Path
        d='M1.5 8.08337H22.5L15.5 1.08337M22.9661 13.9167H1.96608L8.96608 20.9167'
        stroke='white'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};
export default withIcon(IconSwap);
