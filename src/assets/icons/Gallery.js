import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Gallery({size}) {
  return (
    <Svg
      width={size || 35}
      height={size || 28}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.74 1.286a4.333 4.333 0 10-4.814 7.206A4.333 4.333 0 006.74 1.286zM.117 22.078V28h3.35L14.56 16.95l-3.741-3.654a1.444 1.444 0 00-2.037 0L.116 22.078zM7.554 28h27.228v-8.407l-8.392-8.392a1.444 1.444 0 00-2.037 0l-7.8 7.8-8.999 9z"
        fill="#fff"
      />
    </Svg>
  );
}

export default Gallery;
