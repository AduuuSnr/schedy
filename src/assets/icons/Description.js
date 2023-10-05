import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Description({size, color}) {
  return (
    <Svg
      width={size || 16}
      height={size || 16}
      viewBox="0 0 16 16"
      fill={color || MainBlue}
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M11.2 0H4.8A4.805 4.805 0 000 4.8v10.4a.8.8 0 00.8.8h10.4c2.647 0 4.8-2.153 4.8-4.8V4.8C16 2.153 13.847 0 11.2 0zM9.6 10.4H4V8.8h5.6v1.6zM12 7.2H4V5.6h8v1.6z"
        fill="#4A43EC"
      />
    </Svg>
  );
}

export default Description;
