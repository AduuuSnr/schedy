import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function MessageCircle({size, color}) {
  return (
    <Svg
      width={size || 18}
      height={size || 17}
      viewBox="0 0 18 17"
      fill={color || '#3D50DF'}
      xmlns="http://www.w3.org/2000/svg">
      <Path
        clipRule="evenodd"
        d="M16.462 8.082a7 7 0 01-.752 3.175 7.102 7.102 0 01-6.35 3.927 7.002 7.002 0 01-3.175-.752l-4.762 1.587 1.587-4.762a7 7 0 01-.751-3.175 7.102 7.102 0 013.926-6.35A7.001 7.001 0 019.36.982h.418a7.085 7.085 0 016.684 6.684v.417z"
        stroke="#767676"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default MessageCircle;
