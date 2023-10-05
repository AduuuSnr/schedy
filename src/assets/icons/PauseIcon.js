import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function PauseIcon({size, color}) {
  return (
    <Svg
      width={size || 21}
      height={size || 20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10.278 0c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10zm0 18c-4.41 0-8-3.589-8-8s3.59-8 8-8c4.411 0 8 3.589 8 8s-3.589 8-8 8z"
        fill={color || '#000'}
      />
      <Path d="M11.278 7h2v6h-2V7zm-4 0h2v6h-2V7z" fill={color || '#000'} />
    </Svg>
  );
}

export default PauseIcon;
