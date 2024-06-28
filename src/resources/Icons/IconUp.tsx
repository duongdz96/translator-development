import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import { withIcon } from '~/libs/IconDecorator';

const IconUp = (): JSX.Element => {
    return (
        <Svg
            width='10'
            height='6'
            viewBox='0 0 10 6'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <Path
                d="M9 5L5 1L1 5"
                stroke="#A0A0A0"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </Svg>
    );
};

export default withIcon(IconUp);
