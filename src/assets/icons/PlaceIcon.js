import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function PlaceIcon({size, color}) {
  return (
    <Svg
      width={size || 16}
      height={size || 16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G
        clipPath="url(#prefix__clip0_34:5532)"
        strokeLinecap="round"
        strokeLinejoin="round">
        <Path
          d="M14 6.667c0 4.666-6 8.666-6 8.666s-6-4-6-8.667a6 6 0 1112 0z"
          fill="#ADAFBB"
          stroke="#ADAFBB"
          strokeWidth={1.5}
        />
        <Path d="M8 8.666a2 2 0 100-4 2 2 0 000 4z" fill="#fff" stroke="#fff" />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_34:5532">
          <Path fill="#fff" d="M0 0h16v16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default PlaceIcon;
