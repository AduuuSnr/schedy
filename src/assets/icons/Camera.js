import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Camera({size, color}) {
  return (
    <Svg
      width={size || 46}
      height={size || 46}
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M23 17.25c-3.116 0-5.75 2.634-5.75 5.75s2.634 5.75 5.75 5.75 5.75-2.634 5.75-5.75-2.634-5.75-5.75-5.75z"
        fill={color || '#3D50DF'}
      />
      <Path
        d="M38.333 9.584h-4.956l-5.189-5.189a1.91 1.91 0 00-1.355-.561h-7.666a1.908 1.908 0 00-1.356.561l-5.188 5.189H7.667a3.837 3.837 0 00-3.834 3.833V34.5a3.837 3.837 0 003.834 3.834h30.666a3.837 3.837 0 003.834-3.834V13.417a3.837 3.837 0 00-3.834-3.833zM23 32.584c-5.194 0-9.583-4.39-9.583-9.584s4.389-9.583 9.583-9.583 9.583 4.389 9.583 9.583-4.389 9.584-9.583 9.584z"
        fill={color || '#3D50DF'}
      />
    </Svg>
  );
}

export default Camera;
