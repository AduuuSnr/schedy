import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function MicUnmuted({size, color}) {
  return (
    <Svg
      width={size || 16}
      height={size || 16}
      fill={color || MainBlue}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg">
      <Path d="M5 3a3 3 0 116 0v5a3 3 0 01-6 0V3z" fill={color || MainBlue} />
      <Path
        d="M3.5 6.5A.5.5 0 014 7v1a4 4 0 108 0V7a.5.5 0 011 0v1a5 5 0 01-4.5 4.975V15h3a.5.5 0 010 1h-7a.5.5 0 010-1h3v-2.025A5 5 0 013 8V7a.5.5 0 01.5-.5z"
        fill={color || MainBlue}
      />
    </Svg>
  );
}

export default MicUnmuted;
