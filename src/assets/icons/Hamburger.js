import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Hamburger({size, color}) {
  return (
    <Svg
      width={size || 24}
      height={size || 20}
      viewBox="0 0 24 20"
      fill={color || MainBlue}
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 1.2A1.2 1.2 0 011.2 0h21.6a1.2 1.2 0 010 2.4H1.2A1.2 1.2 0 010 1.2zm0 8.4a1.2 1.2 0 011.2-1.2h15.6a1.2 1.2 0 010 2.4H1.2A1.2 1.2 0 010 9.6zm1.2 7.2a1.2 1.2 0 000 2.4h21.6a1.2 1.2 0 100-2.4H1.2z"
        fill="#2A2A2A"
        opacity={0.94}
      />
    </Svg>
  );
}

export default Hamburger;
