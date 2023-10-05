import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Location({size, color}) {
  return (
    <Svg
      width={size || 46}
      height={size || 46}
      viewBox="0 0 46 46"
      fill={MainBlue}
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M23 21.563a5.75 5.75 0 100-11.5 5.75 5.75 0 000 11.5z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M34.5 21.563C30.187 31.624 23 43.124 23 43.124s-7.188-11.5-11.5-21.563C7.187 11.5 14.375 2.875 23 2.875S38.813 11.5 34.5 21.563z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Location;
