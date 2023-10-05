import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Lock({size, color}) {
  return (
    <Svg
      width={size || 22}
      height={size || 22}
      viewBox="0 0 22 22"
      fill={'none'}
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15.055 8.66V6.692a4.172 4.172 0 00-4.172-4.171 4.17 4.17 0 00-4.19 4.153V8.66"
        stroke={color || '#807A7A'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        clipRule="evenodd"
        d="M14.376 19.479H7.372a3.476 3.476 0 01-3.476-3.476V12.07a3.476 3.476 0 013.476-3.476h7.004a3.476 3.476 0 013.476 3.476v3.932a3.476 3.476 0 01-3.476 3.476z"
        stroke={color || '#807A7A'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.874 13.019v2.036"
        stroke={color || '#807A7A'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Lock;
