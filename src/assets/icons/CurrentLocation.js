import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CurrentLocation({size, color}) {
  return (
    <Svg
      width={size || 32}
      height={size || 32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4 12.983a1 1 0 00.629.945l9.6 3.841 3.842 9.602a1 1 0 00.929.63h.016a1 1 0 00.924-.659l8-22a1 1 0 00-1.282-1.283l-22 8a1 1 0 00-.658.925z"
        fill={color || '#fff'}
      />
    </Svg>
  );
}

export default CurrentLocation;
