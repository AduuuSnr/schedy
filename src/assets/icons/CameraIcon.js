import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CameraIcon({size, color}) {
  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M14.438 7.547v7.875a1.314 1.314 0 01-1.313 1.312H3.937a3.285 3.285 0 01-3.28-3.28V5.577a1.314 1.314 0 011.312-1.312h9.187a3.285 3.285 0 013.281 3.28zm5.579-1.552a.656.656 0 00-.655-.002L16.08 7.868a.655.655 0 00-.331.57v4.124a.656.656 0 00.33.57l3.282 1.875a.657.657 0 00.982-.57V6.564a.656.656 0 00-.327-.568z"
        fill={color || '#3D50DF'}
      />
    </Svg>
  );
}

export default CameraIcon;
