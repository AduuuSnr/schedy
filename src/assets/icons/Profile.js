import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function Profile({size, color}) {
  return (
    <Svg
      width={size || 22}
      height={size || 22}
      viewBox="0 0 22 22"
      fill={'none'}
      xmlns="http://www.w3.org/2000/svg">
      <Circle
        cx={10.614}
        cy={6.672}
        stroke={color || '#807A7A'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        r={4.38}
      />
      <Path
        clipRule="evenodd"
        d="M3.667 17.143a2.03 2.03 0 01.2-.89c.42-.838 1.603-1.283 2.585-1.484a15.38 15.38 0 012.148-.303 22.975 22.975 0 014.02 0c.721.051 1.44.152 2.147.303.982.2 2.165.604 2.585 1.485a2.081 2.081 0 010 1.787c-.42.88-1.603 1.284-2.585 1.477a14.41 14.41 0 01-2.148.31 23.684 23.684 0 01-3.272.05c-.252 0-.495 0-.747-.05a14.14 14.14 0 01-2.14-.31c-.99-.193-2.164-.596-2.592-1.477a2.09 2.09 0 01-.201-.898z"
        stroke={color || '#807A7A'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Profile;
