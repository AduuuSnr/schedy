import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function BlueNotification({size}) {
  return (
    <Svg
      width={size || 36}
      height={size || 36}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle
        opacity={0.1}
        cx={18}
        cy={18}
        r={17.5}
        fill="#3D50DF"
        stroke="#2A2A2A"
      />
      <Path
        d="M23 14.667a5 5 0 00-10 0c0 5.833-2.5 7.5-2.5 7.5h15S23 20.5 23 14.667M19.442 25.5a1.667 1.667 0 01-2.884 0"
        stroke="#5669FF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BlueNotification;
