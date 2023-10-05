import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function Hangup({size}) {
  return (
    <Svg
      width={size || 24}
      height={size || 24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#prefix__clip0)">
        <Path
          d="M23.846 13.5c.187 1.3.31 3.08-.273 3.76-.965 1.127-7.072 1.127-7.072-1.126 0-1.134 1.005-1.878.041-3.005-.948-1.106-2.649-1.124-4.54-1.126-1.892-.002-3.591.018-4.541 1.127-.964 1.126.04 1.87.04 3.004 0 2.252-6.106 2.252-7.07 1.127C-.153 16.58-.03 14.8.158 13.5c.144-.868.508-1.805 1.677-3 1.752-1.635 4.402-2.97 10.074-3h.188c5.672.029 8.322 1.365 10.075 3 1.166 1.195 1.532 2.132 1.677 3h-.003z"
          fill={'red'}
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path fill="#fff" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default Hangup;
