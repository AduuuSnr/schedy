import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function EndDate({size, color}) {
  return (
    <Svg
      width={size || 16}
      height={size || 16}
      viewBox="0 0 16 16"
      fill={color || MainBlue}
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4 .5a.5.5 0 00-1 0V1H2a2 2 0 00-2 2v1h16V3a2 2 0 00-2-2h-1V.5a.5.5 0 00-1 0V1H4V.5zM16 14V5H0v9a2 2 0 002 2h12a2 2 0 002-2zM6.854 8.146L8 9.293l1.146-1.147a.5.5 0 11.708.708L8.707 10l1.147 1.146a.5.5 0 01-.708.708L8 10.707l-1.146 1.147a.5.5 0 01-.708-.708L7.293 10 6.146 8.854a.5.5 0 01.708-.708z"
        fill="#4A43EC"
      />
    </Svg>
  );
}

export default EndDate;
