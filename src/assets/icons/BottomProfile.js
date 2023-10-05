import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function BottomProfile({size, color}) {
  return (
    <Svg
      width={size || 23}
      height={size || 23}
      viewBox=" 0 0 23  23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.535 7.092c0 2.858-2.253 5.175-5.032 5.175-2.78 0-5.033-2.317-5.033-5.175 0-2.858 2.253-5.175 5.033-5.175 2.779 0 5.032 2.317 5.032 5.175zm-.713 8.091c1.6.324 2.645.853 3.093 1.705a2.36 2.36 0 010 2.123c-.448.853-1.451 1.416-3.11 1.706a16.09 16.09 0 01-2.238.29c-.696.076-1.393.076-2.098.076h-1.268a6.049 6.049 0 00-.771-.051c-.752-.039-1.5-.133-2.239-.281-1.6-.307-2.644-.853-3.092-1.706-.173-.33-.264-.699-.265-1.074-.004-.377.084-.75.257-1.083.439-.852 1.484-1.407 3.1-1.705.742-.146 1.493-.24 2.247-.281a25.798 25.798 0 014.146 0c.75.043 1.499.138 2.238.281z"
        fill={color || '#D5D7DC'}
      />
    </Svg>
  );
}

export default BottomProfile;