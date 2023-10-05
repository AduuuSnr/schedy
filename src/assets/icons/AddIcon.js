import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function AddIcon({size}) {
  return (
    <Svg
      width={size || 46}
      height={size || 46}
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 46c12.703 0 23-10.297 23-23S35.703 0 23 0 0 10.297 0 23s10.297 23 23 23z"
        fill="#5669FF"
      />
      <Path
        d="M23 15v17M31 23H14"
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default AddIcon;
