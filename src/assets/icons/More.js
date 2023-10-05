import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function More({color, size}) {
  return (
    <Svg
      width={size || 22}
      height={size || 22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M11 11.917a.917.917 0 100-1.834.917.917 0 000 1.834zM11 5.5a.917.917 0 100-1.833.917.917 0 000 1.833zM11 18.333a.917.917 0 100-1.833.917.917 0 000 1.833z"
        fill={color || '#060518'}
        stroke={color || '#060518'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default More;
