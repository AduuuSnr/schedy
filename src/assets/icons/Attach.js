import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Attach({size}) {
  return (
    <Svg
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M6 7.91V16a6 6 0 1012 0V6a4 4 0 10-8 0v9.182a2 2 0 002 2v0a2 2 0 002-2V8"
        stroke="#3D50DF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Attach;
