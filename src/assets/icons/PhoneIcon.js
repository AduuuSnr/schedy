import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function PhoneIcon({size, color}) {
  return (
    <Svg
      width={size || 22}
      height={size || 22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M5.36 4.092L7.451 2.05a1.57 1.57 0 012.227.026l2.198 2.252a1.568 1.568 0 01.45 1.118 1.567 1.567 0 01-.476 1.109l-1.646 1.608a7.648 7.648 0 001.536 2.272 7.674 7.674 0 002.236 1.596l1.646-1.608a1.57 1.57 0 012.227.026l2.2 2.25a1.573 1.573 0 01-.025 2.229l-2.089 2.04a2.552 2.552 0 01-2.22.684c-2.612-.462-5.191-1.885-7.261-4.003-2.069-2.116-3.428-4.726-3.834-7.356a2.556 2.556 0 01.738-2.201z"
        fill={color || '#3D50DF'}
      />
    </Svg>
  );
}

export default PhoneIcon;
