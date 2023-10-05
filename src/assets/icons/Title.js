import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Title({size, color}) {
  return (
    <Svg
      width={size || 12}
      height={size || 16}
      viewBox="0 0 12 16"
      fill={color || MainBlue}
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4.5 0a1.5 1.5 0 00-1.415 1H1.5A1.5 1.5 0 000 2.5v12A1.5 1.5 0 001.5 16h9a1.5 1.5 0 001.5-1.5v-12A1.5 1.5 0 0010.5 1H8.915A1.5 1.5 0 007.5 0h-3zM4 1.5a.5.5 0 01.5-.5h3a.5.5 0 110 1h-3a.5.5 0 01-.5-.5zm4.854 6.354l-3.5 3.5a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 01.708-.708L5 10.293l3.146-3.147a.5.5 0 11.708.708z"
        fill={color || MainBlue}
      />
    </Svg>
  );
}

export default Title;
