import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function BackIcon({size}) {
  return (
    <Svg
      width={size || 22}
      height={size || 22}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M19.617 11H4.583M11 17.417L4.583 11 11 4.583"
        stroke="#FFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BackIcon;
