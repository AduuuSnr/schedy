import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function AlertIcon({size}) {
  return (
    <Svg
      width={size || 23}
      height={size || 23}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.543 2.598a2.821 2.821 0 00-5.086 0L.341 18.563C-.63 20.469.597 23 2.883 23h16.233c2.287 0 3.512-2.53 2.543-4.437L13.543 2.598zM11 8a1 1 0 011 1v5a1 1 0 01-2 0V9a1 1 0 011-1zm0 8.5a1 1 0 011 1v.5a1 1 0 01-2 0v-.5a1 1 0 011-1z"
        fill="#3D50DF"
      />
    </Svg>
  );
}

export default AlertIcon;
