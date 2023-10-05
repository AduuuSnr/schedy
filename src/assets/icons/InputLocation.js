import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function InputLocation({size}) {
  return (
    <Svg
      width={size || 14}
      height={size || 19}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M7 18.003a29.779 29.779 0 01-3.5-3.53C1.9 12.56 0 9.716 0 7.003a7 7 0 0111.952-4.95A6.955 6.955 0 0114 7.003c0 2.713-1.9 5.559-3.5 7.47a29.78 29.78 0 01-3.5 3.53zm0-14a3 3 0 100 6 3 3 0 000-6z"
        fill="#4A43EC"
      />
    </Svg>
  );
}

export default InputLocation;
