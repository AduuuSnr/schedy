import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function MapLine({size, color}) {
  return (
    <Svg
      width={size || 22}
      height={size || 22}
      viewBox="0 0 22 22"
      fill={color || MainBlue}
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M20.527 3.783a.611.611 0 00-.544-.116L14.11 5.5 8.226 2.512a.611.611 0 00-.514 0L1.602 5.01a.611.611 0 00-.38.568v12.516a.611.611 0 00.844.562l5.878-2.414 5.861 3.007a.61.61 0 00.281.067c.06.01.123.01.183 0l6.112-1.907a.612.612 0 00.427-.61V4.277a.611.611 0 00-.28-.495zm-.972 12.564l-5.084 1.589v-1.4h-.978v1.223L8.36 15.125v-1.033h-.978v1.051l-4.938 2.035V5.983l4.938-2.035v1.436h.978v-1.43l5.133 2.628v1.283h.978V6.722l5.084-1.613v11.238z"
        fill="#767676"
      />
      <Path
        d="M13.493 9.203h.978v2.329h-.978V9.202zM13.493 12.87h.978V15.2h-.978V12.87zM7.382 6.759h.978v2.328h-.978V6.76zM7.382 10.468h.978v2.292h-.978v-2.292z"
        fill="#767676"
      />
    </Svg>
  );
}

export default MapLine;
