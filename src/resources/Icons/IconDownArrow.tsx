import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import { InjectedProps, withIcon } from '~/libs/IconDecorator';

const IconDownArrow = ({
  width,
  height,
  style,
  fill,
}: InjectedProps): JSX.Element => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox='0 0 10 6'
      fill="none"
      style={style}>
      
    <Path d="M1 1L5 5L9 1" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>


    </Svg>
  );
};

export default withIcon(IconDownArrow);
