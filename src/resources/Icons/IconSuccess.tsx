import * as React from 'react';
import Svg, {  Path  } from 'react-native-svg';

import { InjectedProps, withIcon } from '~/libs/IconDecorator';

const IconSuccess = ({
  width,
  height,
  fill,
  style,
}: InjectedProps): JSX.Element => {
  return (
    <Svg
      width={width}
      height={height}
      style={style}
      viewBox='0 0 32 32'
      fill={fill}>
      <Path
        d='M13.5 23.9999L4.5 14.9999L5.914 13.5859L13.5 21.1709L27.086 7.58594L28.5 8.99994L13.5 23.9999Z'
        fill='#0057E7'
      />
    </Svg>
  );
};
export default withIcon(IconSuccess);
