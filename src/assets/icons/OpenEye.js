import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function OpenEye({size, color}) {
  return (
    <Svg
      width={size || 20}
      height={size || 14}
      viewBox="0 0 20 14"
      fill={'none'}
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10 4a2.667 2.667 0 110 5.333A2.667 2.667 0 0110 4z"
        fill={color || '#747688'}
      />
      <Path
        d="M15.784 11.451c-1.822 1.25-3.771 1.883-5.794 1.883-1.82 0-3.595-.542-5.275-1.604C3.022 10.657 1.361 8.71 0 6.667c1.1-1.833 2.607-3.718 4.175-4.8C5.975.629 7.93 0 9.99 0c2.042 0 3.994.628 5.804 1.866 1.594 1.092 3.11 2.975 4.206 4.8-1.1 1.81-2.62 3.69-4.216 4.785zM10 2.667a4 4 0 100 8 4 4 0 000-8z"
        fill={color || '#747688'}
      />
    </Svg>
  );
}

export default OpenEye;
