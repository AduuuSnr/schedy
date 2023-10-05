import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Picture({size, color}) {
  return (
    <Svg
      width={size || 25}
      height={size || 21}
      viewBox="0 0 25 21"
      fill={color || MainBlue}
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M24.583 13.565L19.247 8.2a3.626 3.626 0 00-5.667.703L6.545 20.167H4.042a3.625 3.625 0 01-3.625-3.625V4.458A3.625 3.625 0 014.042.834h16.916a3.625 3.625 0 013.625 3.625v9.107zm-.013 3.291a3.625 3.625 0 01-3.612 3.31H9.648l6.005-10.02a1.21 1.21 0 011.888-.236l7.03 6.946zM7.667 11.708a3.625 3.625 0 100-7.25 3.625 3.625 0 000 7.25z"
        fill="#4A43EC"
      />
    </Svg>
  );
}

export default Picture;
