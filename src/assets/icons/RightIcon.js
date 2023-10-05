import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function RightIcon({size}) {
  return (
    <Svg
      width={size || 7}
      height={size || 11}
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1 1l4.5 4.5L1 10"
        stroke="#5669FF"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default RightIcon;
