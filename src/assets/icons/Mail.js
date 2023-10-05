import {LightGray, MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Mail({size, color}) {
  return (
    <Svg
      width={size || 22}
      height={size || 22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15.829 8.306l-3.91 3.148c-.74.58-1.777.58-2.517 0L5.458 8.306"
        stroke={color || '#807A7A'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        clipRule="evenodd"
        d="M6.314 3.208h8.642a4.544 4.544 0 013.282 1.458 4.599 4.599 0 011.216 3.395v5.984a4.599 4.599 0 01-1.216 3.396 4.544 4.544 0 01-3.282 1.457H6.314c-2.677 0-4.48-2.177-4.48-4.853V8.061c0-2.675 1.803-4.853 4.48-4.853z"
        stroke={color || '#807A7A'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Mail;
