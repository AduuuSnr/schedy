import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CloseIcon({size, color}) {
  return (
    <Svg
      width={size || 32}
      height={size || 32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14 14-6.2 14-14S23.8 2 16 2zm5.4 21L16 17.6 10.6 23 9 21.4l5.4-5.4L9 10.6 10.6 9l5.4 5.4L21.4 9l1.6 1.6-5.4 5.4 5.4 5.4-1.6 1.6z"
        fill={color || '#3D50DF'}
      />
    </Svg>
  );
}

export default CloseIcon;
