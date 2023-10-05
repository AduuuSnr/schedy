import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function FlipCamera({size}) {
  return (
    <Svg
      width={size || 20}
      height={size || 20}
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M16.667 4.167h-2.642L12.5 2.5h-5L5.975 4.167H3.333c-.916 0-1.666.75-1.666 1.666v10c0 .917.75 1.667 1.666 1.667h13.334c.916 0 1.666-.75 1.666-1.667v-10c0-.916-.75-1.666-1.666-1.666zM10 15a4.168 4.168 0 01-4.167-4.167H4.167L6.25 8.75l2.083 2.083H6.667A3.332 3.332 0 0010 14.167c.483 0 .942-.109 1.35-.292l.617.617C11.375 14.8 10.717 15 10 15zm3.75-2.083l-2.083-2.084h1.666A3.332 3.332 0 0010 7.5c-.483 0-.942.108-1.35.292l-.617-.609A4.14 4.14 0 0110 6.667c2.3 0 4.167 1.866 4.167 4.166h1.666l-2.083 2.084z"
        fill={MainBlue}
      />
    </Svg>
  );
}

export default FlipCamera;
