import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Edit({size, color}) {
  return (
    <Svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M2.11 11.6l-.95 4.1a1.03 1.03 0 001 1.25c.071.007.144.007.215 0L6.5 16l7.92-7.89L10 3.7l-7.89 7.9zM16.91 4.16l-2.95-2.95a1.035 1.035 0 00-1.46 0l-1.64 1.64 4.415 4.415 1.64-1.64a1.035 1.035 0 00-.005-1.465z"
        fill={color || '#fff'}
      />
    </Svg>
  );
}

export default Edit;
