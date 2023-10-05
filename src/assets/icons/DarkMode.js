import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function DarkMode({size, color}) {
  return (
    <Svg
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M12 11.807A9.002 9.002 0 0110.049 2a9.942 9.942 0 00-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142 3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 002.735-5.119A9.004 9.004 0 0112 11.807z"
        fill={color || '#2F80ED'}
      />
    </Svg>
  );
}

export default DarkMode;
