import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function MutedMic({size, color}) {
  return (
    <Svg
      width={size || 16}
      height={size || 16}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#prefix__clip0)" fill={color || MainBlue}>
        <Path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814c.053-.263.08-.53.08-.8V7a.5.5 0 011 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 01-2.43.923V15h3a.5.5 0 010 1h-7a.5.5 0 010-1h3v-2.025A5 5 0 013 8V7a.5.5 0 111 0v1a4 4 0 004 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0111 3z" />
        <Path d="M9.486 10.607L5 6.12V8a3 3 0 004.486 2.607zm-7.84-9.253l12 12 .708-.708-12-12-.708.708z" />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path fill={color || MainBlue} d="M0 0h16v16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default MutedMic;
